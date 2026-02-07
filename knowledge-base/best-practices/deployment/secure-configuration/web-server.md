# Web 服务器安全配置

## 📋 概述

Web 服务器安全配置是指安全地配置 Web 服务器（如 Nginx、Apache）以确保应用的安全性。本指南提供了 Web 服务器安全配置的最佳实践。

## 🎯 适用场景

Web 服务器安全配置适用于以下场景：

- Nginx 安全配置
- Apache 安全配置
- Caddy 安全配置
- Web 服务器 SSL/TLS 配置
- Web 服务器安全头配置

## 🔍 实现指南

### 1. Nginx 安全配置

安全地配置 Nginx。

#### 1.1 Nginx 主配置

```nginx
# nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    log_format security '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for" '
                      '$request_time $upstream_response_time';

    access_log /var/log/nginx/access.log main;

    # 性能优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 10M;

    # 隐藏版本号
    server_tokens off;
    more_clear_headers 'Server';

    # 安全头
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # 限制请求方法
    if ($request_method !~ ^(GET|HEAD|POST)$ ) {
        return 405;
    }

    # 限制请求大小
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;

    # 限制连接数
    limit_conn_zone $binary_remote_addr zone=conn_limit_per_ip:10m;
    limit_req_zone $binary_remote_addr zone=req_limit_per_ip:10m rate=10r/s;

    # 限制请求速率
    limit_conn conn_limit_per_ip 10;
    limit_req zone=req_limit_per_ip burst=20 nodelay;

    # 禁用不需要的方法
    if ($request_method ~* ^(TRACE|TRACK)$ ) {
        return 403;
    }

    # 禁用访问隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # 禁用访问备份文件
    location ~ ~$ {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    # 包含站点配置
    include /etc/nginx/conf.d/*.conf;
}
```

#### 1.2 Nginx SSL 配置

```nginx
# conf.d/ssl.conf
# SSL 协议
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;

# SSL 加密套件
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';

# SSL 会话缓存
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_session_tickets off;

# SSL OCSP Stapling
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/nginx/ssl/ca-bundle.crt;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;

# SSL 证书
ssl_certificate /etc/nginx/ssl/cert.pem;
ssl_certificate_key /etc/nginx/ssl/key.pem;

# DH 参数
ssl_dhparam /etc/nginx/ssl/dhparam.pem;
```

#### 1.3 Nginx 站点配置

```nginx
# conf.d/example.com.conf
server {
    listen 80;
    server_name example.com www.example.com;

    # 强制 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    # SSL 配置
    include /etc/nginx/conf.d/ssl.conf;

    # 根目录
    root /usr/share/nginx/html;
    index index.html;

    # 字符集
    charset utf-8;

    # 安全头
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.example.com; object-src 'none'; frame-src 'none';" always;

    # 日志
    access_log /var/log/nginx/example.com.access.log main;
    error_log /var/log/nginx/example.com.error.log warn;

    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 禁止访问敏感文件
    location ~* \.(env|log|sql|git|svn)$ {
        deny all;
        access_log off;
        log_not_found off;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # 就绪检查
    location /ready {
        access_log off;
        return 200 "ready\n";
        add_header Content-Type text/plain;
    }
}
```

### 2. Apache 安全配置

安全地配置 Apache。

#### 2.1 Apache 主配置

```apache
# httpd.conf
# 隐藏版本号
ServerTokens Prod
ServerSignature Off

# 禁用 TRACE 方法
TraceEnable Off

# 限制请求大小
LimitRequestBody 10485760
LimitRequestFields 100
LimitRequestFieldSize 8190
LimitRequestLine 8190

# 限制连接数
MaxRequestWorkers 150
MaxConnectionsPerChild 0

# 超时设置
Timeout 60
KeepAlive On
MaxKeepAliveRequests 100
KeepAliveTimeout 5

# 安全模块
LoadModule security2_module modules/mod_security2.so
LoadModule unique_id_module modules/mod_unique_id.so
LoadModule headers_module modules/mod_headers.so

# 安全头
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# 禁用访问隐藏文件
<DirectoryMatch "^\.|\.git|\.svn">
    Require all denied
</DirectoryMatch>

# 禁用访问备份文件
<FilesMatch "\.(bak|backup|old|orig|save|swp)$">
    Require all denied
</FilesMatch>

# 日志格式
LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\"" combined
LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\" %T \"%{X-Forwarded-For}i\"" security

# 日志
ErrorLog "logs/error_log"
CustomLog "logs/access_log" combined
```

#### 2.2 Apache SSL 配置

```apache
# conf.d/ssl.conf
# SSL 协议
SSLProtocol all -SSLv2 -SSLv3 -TLSv1 -TLSv1.1

# SSL 加密套件
SSLCipherSuite HIGH:!aNULL:!MD5:!3DES
SSLHonorCipherOrder on

# SSL 会话缓存
SSLSessionCache "shmcb:logs/ssl_scache(512000)"
SSLSessionCacheTimeout 300

# SSL OCSP Stapling
SSLUseStapling On
SSLStaplingCache "shmcb:logs/ocsp(128000)"

# SSL 证书
SSLCertificateFile /etc/httpd/ssl/cert.pem
SSLCertificateKeyFile /etc/httpd/ssl/key.pem
SSLCertificateChainFile /etc/httpd/ssl/ca-bundle.crt

# SSL 压缩
SSLCompression off
```

#### 2.3 Apache 站点配置

```apache
# conf.d/example.com.conf
<VirtualHost *:80>
    ServerName example.com
    ServerAlias www.example.com
    
    # 强制 HTTPS
    Redirect permanent / https://example.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName example.com
    ServerAlias www.example.com
    
    # SSL 配置
    Include conf.d/ssl.conf
    
    # 根目录
    DocumentRoot "/var/www/html"
    DirectoryIndex index.html
    
    # 字符集
    AddDefaultCharset UTF-8
    
    # 安全头
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.example.com; object-src 'none'; frame-src 'none';"
    
    # 日志
    ErrorLog "logs/example.com-error_log"
    CustomLog "logs/example.com-access_log" combined
    
    # 目录配置
    <Directory "/var/www/html">
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted
        
        # SPA 路由
        <IfModule mod_rewrite.c>
            RewriteEngine On
            RewriteBase /
            RewriteRule ^index\.html$ - [L]
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteRule . /index.html [L]
        </IfModule>
    </Directory>
    
    # 静态资源缓存
    <LocationMatch "\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
        Header set Cache-Control "public, immutable"
    </LocationMatch>
    
    # 健康检查
    <Location /health>
        Require all granted
        SetHandler server-status
    </Location>
</VirtualHost>
```

### 3. Caddy 安全配置

安全地配置 Caddy。

#### 3.1 Caddyfile 配置

```
# Caddyfile
{
    # 全局选项
    email admin@example.com
    
    # 隐藏版本号
    servers {
        protocols h2 h3
    }
}

example.com {
    # 强制 HTTPS
    @http {
        protocol http
    }
    redir @http https://{host}{uri}
    
    # 根目录
    root * /usr/share/nginx/html
    file_server
    
    # SPA 路由
    try_files {path} /index.html
    
    # 安全头
    header {
        X-Frame-Options "DENY"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "geolocation=(), microphone=(), camera=()"
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.example.com; object-src 'none'; frame-src 'none';"
    }
    
    # 静态资源缓存
    @static {
        path *.jpg *.jpeg *.png *.gif *.ico *.css *.js *.svg *.woff *.woff2 *.ttf *.eot
    }
    header @static Cache-Control "public, immutable"
    
    # 健康检查
    handle /health {
        respond "healthy" 200
    }
    
    # 日志
    log {
        output file /var/log/caddy/access.log
        format json
    }
}
```

## 📚 代码示例

### Nginx 配置生成脚本

```bash
#!/bin/bash
# scripts/generate-nginx-config.sh

DOMAIN=$1
SSL_CERT=$2
SSL_KEY=$3

if [ -z "$DOMAIN" ] || [ -z "$SSL_CERT" ] || [ -z "$SSL_KEY" ]; then
    echo "用法: $0 <域名> <SSL 证书> <SSL 密钥>"
    exit 1
fi

echo "生成 Nginx 配置: ${DOMAIN}"

cat > /etc/nginx/conf.d/${DOMAIN}.conf << EOF
server {
    listen 80;
    server_name ${DOMAIN};

    # 强制 HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN};

    # SSL 配置
    ssl_certificate ${SSL_CERT};
    ssl_certificate_key ${SSL_KEY};
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;

    # 根目录
    root /usr/share/nginx/html;
    index index.html;

    # 安全头
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.example.com; object-src 'none'; frame-src 'none';" always;

    # 日志
    access_log /var/log/nginx/${DOMAIN}.access.log main;
    error_log /var/log/nginx/${DOMAIN}.error.log warn;

    # SPA 路由
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# 测试配置
nginx -t

if [ $? -eq 0 ]; then
    echo "配置生成成功"
    echo "重新加载 Nginx..."
    nginx -s reload
else
    echo "配置测试失败"
    exit 1
fi
```

## 🛠️ 工具推荐

- **Nginx**：高性能 Web 服务器
- **Apache HTTP Server**：功能强大的 Web 服务器
- **Caddy**：自动 HTTPS 的 Web 服务器
- **OpenSSL**：SSL/TLS 工具
- **Certbot**：Let's Encrypt 客户端

## 📝 验证方法

验证 Web 服务器安全配置是否正确实施的方法：

1. **SSL 测试**：使用 SSL Labs 测试 SSL 配置
2. **安全头测试**：使用 securityheaders.io 测试安全头
3. **渗透测试**：进行渗透测试，测试服务器安全性
4. **配置审计**：使用配置审计工具检查配置

## ⚠️ 常见错误

1. **缺少安全头**：
   - **错误描述**：没有设置安全头
   - **风险**：可能被 XSS、CSRF 等攻击
   - **解决方案**：设置完整的安全头

2. **SSL 配置不安全**：
   - **错误描述**：SSL 配置不安全，如使用旧协议
   - **风险**：可能被中间人攻击
   - **解决方案**：使用最新的 SSL/TLS 协议和加密套件

3. **暴露版本信息**：
   - **错误描述**：服务器暴露版本信息
   - **风险**：攻击者可能利用已知漏洞
   - **解决方案**：隐藏服务器版本信息

4. **缺少访问控制**：
   - **错误描述**：没有限制访问敏感文件
   - **风险**：敏感文件可能被访问
   - **解决方案**：配置访问控制规则

## 📚 参考资料

- [OWASP Web Server Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Web_Server_Security_Cheat_Sheet.html)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [Nginx 安全指南](https://nginx.org/en/docs/http/ngx_http_ssl_module.html)
- [Apache 安全指南](https://httpd.apache.org/docs/current/misc/security_tips.html)