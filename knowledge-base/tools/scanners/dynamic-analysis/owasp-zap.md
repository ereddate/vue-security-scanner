# OWASP ZAP 使用指南

## 📋 工具概述

OWASP ZAP (Zed Attack Proxy) 是一个免费、开源的 Web 应用安全扫描工具，由 OWASP（开放式 Web 应用安全项目）开发和维护。它可以帮助开发者和安全专家发现和修复 Web 应用中的安全漏洞。

## 🎯 适用场景

- Web 应用安全测试
- API 安全测试
- 安全漏洞评估
- 渗透测试
- CI/CD 流程中的安全检查
- 安全培训和教育

## 🔍 核心功能

- **自动扫描**：自动扫描 Web 应用，发现常见安全漏洞
- **手动测试**：提供多种手动测试工具，如代理、蜘蛛、模糊测试等
- **被动扫描**：在浏览 Web 应用时被动收集信息，发现安全问题
- **API 测试**：支持 REST、SOAP 等 API 的安全测试
- **报告生成**：生成详细的安全测试报告
- **插件系统**：支持通过插件扩展功能
- **CI/CD 集成**：集成到 CI/CD 流程中，自动检测安全问题

## 🛠️ 安装与配置

### 安装

#### 下载安装包

- 从 [OWASP ZAP 官方网站](https://www.zaproxy.org/download/) 下载适合您操作系统的安装包
- 支持 Windows、macOS、Linux 等操作系统

#### 使用 Docker

```bash
# 拉取 OWASP ZAP Docker 镜像
docker pull owasp/zap2docker-stable

# 运行 OWASP ZAP Docker 容器
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://example.com
```

#### 使用 Snap (Linux)

```bash
# 使用 Snap 安装 OWASP ZAP
sudo snap install zaproxy
```

### 配置

#### 基本配置

1. **启动 OWASP ZAP**
2. **设置代理**：默认代理地址为 `http://localhost:8080`
3. **配置浏览器**：将浏览器的代理设置为 OWASP ZAP 的代理地址
4. **信任 CA 证书**：导入 OWASP ZAP 的 CA 证书到浏览器，以支持 HTTPS 扫描

#### 高级配置

```xml
<!-- zap.xml 配置文件示例 -->
<configuration>
  <proxy>
    <port>8080</port>
    <host>localhost</host>
    <timeout>30</timeout>
  </proxy>
  <scanner>
    <maxRuleDurationInMins>5</maxRuleDurationInMins>
    <maxScanDurationInMins>60</maxScanDurationInMins>
  </scanner>
  <spider>
    <maxDepth>5</maxDepth>
    <maxChildren>10</maxChildren>
  </spider>
</configuration>
```

## 📚 使用示例

### 示例 1：基本扫描

#### 自动扫描

```bash
# 使用命令行工具进行基本扫描
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://example.com

# 扫描并生成 HTML 报告
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://example.com -r report.html

# 扫描并忽略特定规则
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://example.com -j -g gen.conf -r report.html
```

#### 手动扫描

1. **启动 OWASP ZAP**
2. **设置目标 URL**：在地址栏输入目标 Web 应用的 URL
3. **启动蜘蛛**：点击 "Spider" 按钮，爬取 Web 应用的页面
4. **启动主动扫描**：点击 "Active Scan" 按钮，扫描发现的页面
5. **查看结果**：在 "Alerts" 标签页查看发现的安全漏洞

### 示例 2：API 测试

#### 导入 OpenAPI/Swagger 定义

1. **启动 OWASP ZAP**
2. **导入 API 定义**：
   - 点击 "Import" -> "Import API"
   - 选择 "OpenAPI/Swagger" 格式
   - 输入 API 定义的 URL 或上传文件
3. **启动扫描**：对导入的 API 进行扫描

#### 使用命令行扫描 API

```bash
# 扫描 OpenAPI 定义的 API
docker run -t owasp/zap2docker-stable zap-api-scan.py -t https://example.com/openapi.json -f openapi

# 扫描 SOAP API
docker run -t owasp/zap2docker-stable zap-api-scan.py -t https://example.com/wsdl -f soap
```

### 示例 3：CI/CD 集成

#### GitHub Actions 配置

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  zap-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: ZAP Scan
      uses: zaproxy/action-baseline@v0.7.0
      with:
        target: 'https://example.com'
        rules_file_name: '.zap/rules.tsv'
        cmd_options: '-a'
```

#### GitLab CI 配置

```yaml
# .gitlab-ci.yml
zap_scan:
  stage: test
  image: owasp/zap2docker-stable
  script:
    - zap-baseline.py -t https://example.com -r zap-report.html
  artifacts:
    paths:
      - zap-report.html
  only:
    - main
    - merge_requests
```

### 示例 4：使用 ZAP API

```python
# 使用 Python 调用 ZAP API
import requests

# ZAP API 地址
zap_api = 'http://localhost:8080'
api_key = 'your-api-key'  # 如果设置了 API 密钥

# 访问目标 URL
target = 'https://example.com'
requests.get(f'{zap_api}/JSON/core/action/accessUrl/?url={target}&apikey={api_key}')

# 启动蜘蛛
requests.get(f'{zap_api}/JSON/spider/action/scan/?url={target}&apikey={api_key}')

# 启动主动扫描
requests.get(f'{zap_api}/JSON/ascan/action/scan/?url={target}&apikey={api_key}')

# 获取警报
alerts = requests.get(f'{zap_api}/JSON/core/view/alerts/?baseurl={target}&apikey={api_key}').json()
print(alerts)
```

## ⚠️ 注意事项

1. **合法使用**：OWASP ZAP 只能用于测试您有权限的 Web 应用，未经授权测试他人的 Web 应用可能违反法律法规。
2. **性能影响**：扫描可能会对目标 Web 应用造成性能影响，建议在测试环境中进行扫描。
3. **误报**：OWASP ZAP 可能会产生误报，需要安全专家根据实际情况判断。
4. **配置复杂**：OWASP ZAP 的配置较为复杂，需要一定的安全知识和经验。
5. **资源消耗**：扫描大型 Web 应用可能会消耗大量系统资源，需要确保系统有足够的内存和 CPU。
6. **更新**：需要定期更新 OWASP ZAP，以获取最新的漏洞规则和功能。

## 📚 参考资料

- [OWASP ZAP 官方文档](https://www.zaproxy.org/docs/)
- [OWASP ZAP 用户指南](https://www.zaproxy.org/getting-started/)
- [OWASP ZAP API 文档](https://www.zaproxy.org/docs/api/)
- [OWASP 安全测试指南](https://owasp.org/www-project-web-security-testing-guide/)
- [Web 应用安全最佳实践](https://cheatsheetseries.owasp.org/)

## 📝 工具比较

| 工具 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| OWASP ZAP | 免费开源，功能全面，易于使用 | 误报率较高，配置复杂 | Web 应用安全测试，渗透测试 |
| Burp Suite | 功能强大，误报率低，支持高级测试 | 商业软件，价格昂贵 | 专业渗透测试，企业级应用 |
| Acunetix | 自动化程度高，扫描速度快 | 商业软件，价格昂贵 | 大型 Web 应用安全测试 |
| Netsparker | 误报率低，易于使用 | 商业软件，价格昂贵 | 中小型 Web 应用安全测试 |
| Nmap | 网络扫描能力强，开源免费 | Web 应用测试功能有限 | 网络安全扫描，端口扫描 |