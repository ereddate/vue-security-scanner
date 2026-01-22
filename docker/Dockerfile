# Vue Security Scanner Docker Image
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install -g vue-security-scanner

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S scanner -u 1001

# 设置权限
USER scanner

# 创建扫描工作目录
RUN mkdir -p /home/scanner/work

# 设置卷挂载点
VOLUME ["/workspace"]

# 设置入口点
ENTRYPOINT ["vue-security-scanner"]
CMD ["--help"]