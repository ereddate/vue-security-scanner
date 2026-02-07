# 网络安全配置

## 📋 概述

网络安全配置是指安全地配置网络基础设施，确保网络通信的安全性。本指南提供了网络安全配置的最佳实践。

## 🎯 适用场景

网络安全配置适用于以下场景：

- 防火墙配置
- 网络分段
- DDoS 防护
- 网络监控
- 网络加密

## 🔍 实现指南

### 1. 防火墙配置

安全地配置防火墙。

#### 1.1 iptables 配置

```bash
#!/bin/bash
# scripts/configure-firewall.sh

echo "配置防火墙..."

# 清除现有规则
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X

# 设置默认策略
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# 允许本地回环
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# 允许已建立的连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 允许 SSH
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -j ACCEPT

# 允许 HTTP
iptables -A INPUT -p tcp --dport 80 -m state --state NEW -j ACCEPT

# 允许 HTTPS
iptables -A INPUT -p tcp --dport 443 -m state --state NEW -j ACCEPT

# 防止 SYN 洪水攻击
iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT

# 防止端口扫描
iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP

# 防止 ICMP 洪水攻击
iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s --limit-burst 2 -j ACCEPT

# 记录被丢弃的数据包
iptables -A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 4

# 保存规则
iptables-save > /etc/iptables/rules.v4

echo "防火墙配置完成"
```

#### 1.2 UFW 配置

```bash
#!/bin/bash
# scripts/configure-ufw.sh

echo "配置 UFW 防火墙..."

# 设置默认策略
ufw default deny incoming
ufw default allow outgoing

# 允许 SSH
ufw allow 22/tcp

# 允许 HTTP
ufw allow 80/tcp

# 允许 HTTPS
ufw allow 443/tcp

# 限制 SSH 连接速率
ufw limit 22/tcp

# 启用 UFW
ufw enable

# 显示状态
ufw status verbose

echo "UFW 防火墙配置完成"
```

### 2. 网络分段

实施网络分段以隔离不同类型的流量。

#### 2.1 VLAN 配置

```bash
#!/bin/bash
# scripts/configure-vlan.sh

echo "配置 VLAN..."

# 创建 VLAN 接口
ip link add link eth0 name eth0.10 type vlan id 10
ip link add link eth0 name eth0.20 type vlan id 20
ip link add link eth0 name eth0.30 type vlan id 30

# 启用接口
ip link set eth0.10 up
ip link set eth0.20 up
ip link set eth0.30 up

# 配置 IP 地址
ip addr add 192.168.10.1/24 dev eth0.10
ip addr add 192.168.20.1/24 dev eth0.20
ip addr add 192.168.30.1/24 dev eth0.30

# 配置路由
ip route add 192.168.10.0/24 dev eth0.10
ip route add 192.168.20.0/24 dev eth0.20
ip route add 192.168.30.0/24 dev eth0.30

echo "VLAN 配置完成"
```

#### 2.2 子网配置

```bash
#!/bin/bash
# scripts/configure-subnets.sh

echo "配置子网..."

# 创建网桥
ip link add name br0 type bridge
ip link add name br1 type bridge
ip link add name br2 type bridge

# 启用网桥
ip link set br0 up
ip link set br1 up
ip link set br2 up

# 配置 IP 地址
ip addr add 10.0.1.1/24 dev br0
ip addr add 10.0.2.1/24 dev br1
ip addr add 10.0.3.1/24 dev br2

# 配置 NAT
iptables -t nat -A POSTROUTING -s 10.0.1.0/24 -o eth0 -j MASQUERADE
iptables -t nat -A POSTROUTING -s 10.0.2.0/24 -o eth0 -j MASQUERADE
iptables -t nat -A POSTROUTING -s 10.0.3.0/24 -o eth0 -j MASQUERADE

# 配置转发
iptables -A FORWARD -i br0 -o eth0 -j ACCEPT
iptables -A FORWARD -i br1 -o eth0 -j ACCEPT
iptables -A FORWARD -i br2 -o eth0 -j ACCEPT
iptables -A FORWARD -i eth0 -o br0 -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -i eth0 -o br1 -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -i eth0 -o br2 -m state --state RELATED,ESTABLISHED -j ACCEPT

echo "子网配置完成"
```

### 3. DDoS 防护

实施 DDoS 防护措施。

#### 3.1 iptables DDoS 防护

```bash
#!/bin/bash
# scripts/configure-ddos-protection.sh

echo "配置 DDoS 防护..."

# 防止 SYN 洪水攻击
iptables -N SYN_FLOOD
iptables -A SYN_FLOOD -m limit --limit 1/s --limit-burst 3 -j RETURN
iptables -A SYN_FLOOD -j DROP
iptables -A INPUT -p tcp --syn -j SYN_FLOOD

# 防止 ICMP 洪水攻击
iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s --limit-burst 2 -j ACCEPT
iptables -A INPUT -p icmp --icmp-type echo-request -j DROP

# 防止 UDP 洪水攻击
iptables -A INPUT -p udp -m limit --limit 10/s --limit-burst 20 -j ACCEPT
iptables -A INPUT -p udp -j DROP

# 防止碎片攻击
iptables -A INPUT -f -m limit --limit 100/s --limit-burst 200 -j ACCEPT
iptables -A INPUT -f -j DROP

# 防止无效数据包
iptables -A INPUT -m state --state INVALID -j DROP

# 限制连接速率
iptables -A INPUT -p tcp --dport 80 -m connlimit --connlimit-above 50 -j DROP
iptables -A INPUT -p tcp --dport 443 -m connlimit --connlimit-above 50 -j DROP

echo "DDoS 防护配置完成"
```

#### 3.2 Nginx 速率限制

```nginx
# nginx.conf
http {
    # 定义速率限制区域
    limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=two:10m rate=20r/s;
    limit_conn_zone $binary_remote_addr zone=addr:10m;
    
    # 定义连接限制
    limit_conn addr 10;
    
    server {
        listen 80;
        server_name example.com;
        
        # 应用速率限制
        limit_req zone=one burst=20 nodelay;
        
        # 应用连接限制
        limit_conn addr 5;
        
        location / {
            # 应用更严格的速率限制
            limit_req zone=two burst=10 nodelay;
            
            try_files $uri $uri/ /index.html;
        }
        
        # 处理被限制的请求
        error_page 429 = @rate_limited;
        
        location @rate_limited {
            default_type application/json;
            return 429 '{"error": "Too many requests"}';
        }
    }
}
```

### 4. 网络监控

实施网络监控以检测异常活动。

#### 4.1 网络流量监控

```bash
#!/bin/bash
# scripts/monitor-network.sh

INTERFACE=${1:-eth0}
DURATION=${2:-60}

echo "监控网络流量: ${INTERFACE} (${DURATION}秒)"

# 使用 iftop 监控网络流量
iftop -i ${INTERFACE} -t -s ${DURATION} -n

# 使用 nethogs 监控进程网络使用
nethogs -t -d ${DURATION} ${INTERFACE}

# 使用 tcpdump 捕获网络流量
tcpdump -i ${INTERFACE} -w capture.pcap -G ${DURATION}

echo "网络监控完成"
```

#### 4.2 网络异常检测

```javascript
// src/utils/networkMonitor.js
class NetworkMonitor {
  constructor() {
    this.baseline = null
    this.thresholds = {
      bandwidth: 1000000, // 1 Mbps
      latency: 100, // 100 ms
      packetLoss: 0.01 // 1%
    }
    this.alerts = []
  }
  
  // 测量带宽
  async measureBandwidth() {
    const startTime = Date.now()
    const testSize = 1024 * 1024 // 1 MB
    
    try {
      const response = await fetch(`/bandwidth-test?size=${testSize}`, {
        method: 'GET',
        cache: 'no-cache'
      })
      
      const endTime = Date.now()
      const duration = (endTime - startTime) / 1000 // 秒
      const bandwidth = (testSize * 8) / duration // bps
      
      return {
        bandwidth,
        timestamp: startTime
      }
    } catch (error) {
      console.error('带宽测量失败:', error)
      return null
    }
  }
  
  // 测量延迟
  async measureLatency() {
    const measurements = []
    
    for (let i = 0; i < 10; i++) {
      const startTime = Date.now()
      
      try {
        await fetch('/ping', {
          method: 'HEAD',
          cache: 'no-cache'
        })
        
        const endTime = Date.now()
        measurements.push(endTime - startTime)
      } catch (error) {
        console.error('延迟测量失败:', error)
      }
    }
    
    if (measurements.length === 0) {
      return null
    }
    
    const avgLatency = measurements.reduce((a, b) => a + b, 0) / measurements.length
    
    return {
      latency: avgLatency,
      timestamp: Date.now()
    }
  }
  
  // 测量丢包率
  async measurePacketLoss() {
    const total = 100
    let lost = 0
    
    for (let i = 0; i < total; i++) {
      try {
        await fetch('/ping', {
          method: 'HEAD',
          cache: 'no-cache',
          signal: AbortSignal.timeout(1000)
        })
      } catch (error) {
        lost++
      }
    }
    
    const packetLoss = lost / total
    
    return {
      packetLoss,
      timestamp: Date.now()
    }
  }
  
  // 建立基线
  async establishBaseline() {
    console.log('建立网络基线...')
    
    const bandwidthMeasurements = []
    const latencyMeasurements = []
    const packetLossMeasurements = []
    
    for (let i = 0; i < 10; i++) {
      const bandwidth = await this.measureBandwidth()
      const latency = await this.measureLatency()
      const packetLoss = await this.measurePacketLoss()
      
      if (bandwidth) bandwidthMeasurements.push(bandwidth.bandwidth)
      if (latency) latencyMeasurements.push(latency.latency)
      if (packetLoss) packetLossMeasurements.push(packetLoss.packetLoss)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    this.baseline = {
      bandwidth: bandwidthMeasurements.reduce((a, b) => a + b, 0) / bandwidthMeasurements.length,
      latency: latencyMeasurements.reduce((a, b) => a + b, 0) / latencyMeasurements.length,
      packetLoss: packetLossMeasurements.reduce((a, b) => a + b, 0) / packetLossMeasurements.length
    }
    
    console.log('基线建立完成:', this.baseline)
  }
  
  // 检测异常
  async detectAnomalies() {
    if (!this.baseline) {
      console.warn('基线未建立')
      return []
    }
    
    const anomalies = []
    
    // 检测带宽异常
    const bandwidth = await this.measureBandwidth()
    if (bandwidth) {
      const bandwidthRatio = bandwidth.bandwidth / this.baseline.bandwidth
      
      if (bandwidthRatio > 10 || bandwidthRatio < 0.1) {
        anomalies.push({
          type: 'bandwidth_anomaly',
          severity: 'high',
          value: bandwidth.bandwidth,
          baseline: this.baseline.bandwidth,
          ratio: bandwidthRatio
        })
      }
    }
    
    // 检测延迟异常
    const latency = await this.measureLatency()
    if (latency) {
      const latencyDiff = Math.abs(latency.latency - this.baseline.latency)
      
      if (latencyDiff > this.thresholds.latency) {
        anomalies.push({
          type: 'latency_anomaly',
          severity: latencyDiff > 200 ? 'high' : 'medium',
          value: latency.latency,
          baseline: this.baseline.latency,
          diff: latencyDiff
        })
      }
    }
    
    // 检测丢包率异常
    const packetLoss = await this.measurePacketLoss()
    if (packetLoss) {
      const packetLossDiff = packetLoss.packetLoss - this.baseline.packetLoss
      
      if (packetLossDiff > this.thresholds.packetLoss) {
        anomalies.push({
          type: 'packet_loss_anomaly',
          severity: packetLossDiff > 0.05 ? 'high' : 'medium',
          value: packetLoss.packetLoss,
          baseline: this.baseline.packetLoss,
          diff: packetLossDiff
        })
      }
    }
    
    this.alerts.push(...anomalies)
    
    return anomalies
  }
  
  // 获取警报
  getAlerts() {
    return this.alerts
  }
  
  // 清除警报
  clearAlerts() {
    this.alerts = []
  }
}

export default NetworkMonitor
```

## 📚 代码示例

### 网络安全测试脚本

```bash
#!/bin/bash
# scripts/test-network-security.sh

HOST=${1:-example.com}

echo "测试网络安全: ${HOST}"

# 测试端口开放
echo "测试端口开放..."
nmap -p 1-65535 ${HOST}

# 测试 SSL/TLS
echo "测试 SSL/TLS..."
openssl s_client -connect ${HOST}:443 -tls1_2
openssl s_client -connect ${HOST}:443 -tls1_3

# 测试 HTTP 头
echo "测试 HTTP 头..."
curl -I https://${HOST}

# 测试 DDoS 防护
echo "测试 DDoS 防护..."
for i in {1..100}; do
    curl -I https://${HOST} &
done
wait

echo "网络安全测试完成"
```

## 🛠️ 工具推荐

- **iptables**：Linux 防火墙工具
- **UFW**：简化防火墙配置工具
- **nftables**：新一代 Linux 防火墙工具
- **Wireshark**：网络协议分析工具
- **Nmap**：网络扫描工具

## 📝 验证方法

验证网络安全配置是否正确实施的方法：

1. **防火墙测试**：测试防火墙规则是否正确
2. **网络分段测试**：测试网络分段是否有效
3. **DDoS 防护测试**：测试 DDoS 防护是否有效
4. **监控测试**：测试网络监控是否正常工作

## ⚠️ 常见错误

1. **防火墙规则过于宽松**：
   - **错误描述**：防火墙规则过于宽松
   - **风险**：可能被未授权访问
   - **解决方案**：实施最小权限原则

2. **缺少网络分段**：
   - **错误描述**：没有实施网络分段
   - **风险**：攻击可能扩散到整个网络
   - **解决方案**：实施网络分段隔离不同类型的流量

3. **缺少 DDoS 防护**：
   - **错误描述**：没有实施 DDoS 防护
   - **风险**：可能受到 DDoS 攻击
   - **解决方案**：实施 DDoS 防护措施

4. **缺少网络监控**：
   - **错误描述**：没有监控网络活动
   - **风险**：无法及时发现网络攻击
   - **解决方案**：实施网络监控

## 📚 参考资料

- [OWASP Network Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Network_Security_Cheat_Sheet.html)
- [NIST SP 800-41](https://csrc.nist.gov/publications/detail/sp/800-41/rev-4/final)
- [CIS Network Security Benchmark](https://www.cisecurity.org/benchmark/network_security)
- [iptables 教程](https://www.netfilter.org/documentation/)