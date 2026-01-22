# 配置说明

Vue Security Scanner 支持通过配置文件自定义扫描行为，包括忽略特定的检测项或文件。

## 配置文件格式

工具支持以下配置文件（按优先级顺序）：

1. `vue-security-scanner.config.json` (项目根目录)
2. `.vue-security.json` (项目根目录)
3. `vue-security-scanner.config.json` (当前工作目录)
4. `.vue-security.json` (当前工作目录)

也可以通过命令行参数 `-c` 或 `--config` 指定配置文件路径：

```bash
vue-security-scanner -c /path/to/custom-config.json
```

## 配置选项

### scan - 扫描选项

```json
{
  "scan": {
    "ignoreDirs": [
      "node_modules",
      "dist",
      "build",
      ".git",
      "coverage",
      "public"
    ],
    "ignorePatterns": [
      "**/*.min.js",
      "**/vendor/**",
      "**/lib/**"
    ],
    "maxDepth": 10,
    "maxSize": 10
  }
}
```

- `ignoreDirs`: 要忽略的目录列表
- `ignorePatterns`: 要忽略的文件模式（glob格式）
- `maxDepth`: 最大扫描深度
- `maxSize`: 单个文件最大大小（MB）

### rules - 规则配置

可以启用/禁用特定类型的检测规则：

```json
{
  "rules": {
    "xss": {
      "enabled": true,
      "severity": "high",
      "options": {
        "checkVHtml": true,
        "checkTemplateInterpolation": true,
        "checkEventHandlers": true
      }
    },
    "dependencies": {
      "enabled": true,
      "severity": "high",
      "options": {
        "checkKnownVulnerabilities": true,
        "checkDeprecated": false,  // 禁用过时依赖检查
        "checkOutdated": false    // 禁用过时检查
      }
    },
    "secrets": {
      "enabled": true,
      "severity": "high",
      "options": {
        "patterns": [
          "/password\\s*[:=]\\s*[\'\"`][^\'\"`]+[\'\"`]/gi",
          "/secret\\s*[:=]\\s*[\'\"`][^\'\"`]+[\'\"`]/gi",
          "/token\\s*[:=]\\s*[\'\"`][^\'\"`]+[\'\"`]/gi",
          "/api[_-]?key\\s*[:=]\\s*[\'\"`][^\'\"`]+[\'\"`]/gi",
          "/private[_-]?key\\s*[:=]\\s*[\'\"`][^\'\"`]+[\'\"`]/gi",
          "/auth[_-]?token\\s*[:=]\\s*[\'\"`][^\'\"`]+[\'\"`]/gi",
          "/access[_-]?token\\s*[:=]\\s*[\'\"`][^\'\"`]+[\'\"`]/gi",
          "/client[_-]?secret\\s*[:=]\\s*[\'\"`][^\'\"`]+[\'\"`]/gi"
        ]
      }
    },
    "codeSecurity": {
      "enabled": true,
      "severity": "high",
      "options": {
        "checkEvalUsage": true,
        "checkPrototypePollution": true,
        "checkDynamicImports": true,
        "checkRouteParams": true
      }
    },
    "configSecurity": {
      "enabled": true,
      "severity": "medium",
      "options": {
        "checkCorsSettings": true,
        "checkVueConfigs": true
      }
    }
  }
}
```

### output - 输出选项

```json
{
  "output": {
    "format": "text",
    "showProgress": true,
    "showDetails": true,
    "maxIssuesToShow": 100
  }
}
```

## 示例配置

以下是一个示例配置文件，展示了如何忽略某些目录和禁用某些检查：

```json
{
  "scan": {
    "ignoreDirs": [
      "node_modules",
      "dist",
      "build",
      ".git",
      "coverage",
      "public",
      "vue-security-scanner-vscode",  // 忽略VSCode插件目录
      "vite-plugin-vue-security",     // 忽略Vite插件目录
      "tests"
    ],
    "ignorePatterns": [
      "**/*.min.js",
      "**/vendor/**",
      "**/lib/**",
      "**/example-vue-app/**"  // 忽略示例应用
    ]
  },
  "rules": {
    "dependencies": {
      "enabled": true,
      "options": {
        "checkDeprecated": false,  // 禁用过时依赖检查
        "checkOutdated": false     // 禁用过时检查
      }
    },
    "secrets": {
      "enabled": true
    }
  }
}
```

## 如何使用

1. 在项目根目录创建配置文件 `vue-security-scanner.config.json`
2. 根据需要自定义配置
3. 运行扫描命令

配置将在扫描时生效，根据您的需求调整检测范围和规则。