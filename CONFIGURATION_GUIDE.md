# Vue Security Scanner - 配置说明

## 配置文件说明

Vue Security Scanner 支持两种类型的配置文件：

### 1. 主配置文件 (`vue-security-scanner.config.json`)

这是一个 JSON 格式的配置文件，用于定义扫描器的主要行为：

- **rules**: 定义启用哪些安全检测规则及它们的设置
- **scan**: 定义扫描选项，如忽略目录、文件大小限制等
- **output**: 控制输出格式和详细程度
- **plugins**: 配置插件系统的行为

### 2. 忽略规则文件 (`.vue-security-ignore`)

这是一个文本文件，使用类似 `.gitignore` 的语法，用于指定要忽略的内容：

- **文件/目录忽略**: 忽略特定的文件或目录
- **漏洞类型忽略**: 忽略特定类型的漏洞
- **插件忽略**: 忽略特定插件的检测结果
- **严重性忽略**: 忽略特定严重性的漏洞

## 初次使用建议

对于初次使用 Vue Security Scanner 的用户：

1. **无需立即配置**：扫描器带有合理的默认设置
2. **查看完整报告**：默认情况下，所有检测规则都会启用，您可以查看完整的安全报告
3. **逐步自定义**：根据您的项目需求，逐步创建自定义配置

## 示例配置

我们提供了以下示例文件供参考：
- `examples/vue-security-scanner.config.json.example` - 主配置文件示例
- `examples/.vue-security-ignore.example` - 忽略规则文件示例

## 创建自定义配置

要创建自定义配置：

1. 将示例文件复制到您的项目根目录
2. 根据您的需求修改配置
3. 运行扫描器时，配置会自动加载

```bash
# 复制示例配置
cp examples/vue-security-scanner.config.json.example vue-security-scanner.config.json

# 运行扫描
vue-security-scanner
```

## 插件系统

Vue Security Scanner 的插件系统允许您：
- 添加自定义安全检测规则
- 扩展扫描功能
- 自定义检测逻辑

插件存放在 `plugins/` 目录中，扫描器会自动加载所有有效的插件。