# Vue Security Scanner 常见问题

## 1. 安装问题

### 1.1 安装失败

**问题**：执行 `npm install -g vue-security-scanner` 时安装失败。

**解决方案**：
- **权限问题**：尝试使用管理员权限运行命令
  ```bash
  # Windows
  npm install -g vue-security-scanner --unsafe-perm
  
  # Linux/Mac
  sudo npm install -g vue-security-scanner
  ```
- **网络问题**：使用镜像源
  ```bash
  npm install -g vue-security-scanner --registry=https://registry.npmmirror.com
  ```
- **Node.js 版本问题**：确保使用 Node.js 14.0.0 或更高版本
  ```bash
  node -v
  # 如果版本过低，更新 Node.js
  ```

### 1.2 全局安装后命令不可用

**问题**：全局安装后，执行 `vue-security-scanner` 命令提示 "command not found"。

**解决方案**：
- **检查环境变量**：确保 npm 全局安装目录在系统 PATH 中
  ```bash
  # 查看 npm 全局安装目录
  npm prefix -g
  # 将输出的目录添加到系统 PATH
  ```
- **重新安装**：使用 `--force` 选项重新安装
  ```bash
  npm install -g vue-security-scanner --force
  ```
- **使用 npx**：直接使用 npx 运行
  ```bash
  npx vue-security-scanner
  ```

### 1.3 本地安装问题

**问题**：在项目中本地安装时出现依赖冲突。

**解决方案**：
- **使用 --legacy-peer-deps**：
  ```bash
  npm install vue-security-scanner --save-dev --legacy-peer-deps
  ```
- **使用 yarn**：
  ```bash
  yarn add vue-security-scanner --dev
  ```
- **检查依赖版本**：查看项目中是否有版本冲突的依赖
  ```bash
  npm ls
  ```

## 2. 使用问题

### 2.1 扫描速度慢

**问题**：扫描大型项目时速度非常慢。

**解决方案**：
- **启用缓存**：
  ```bash
  vue-security-scanner --cache
  ```
- **启用增量扫描**：
  ```bash
  vue-security-scanner --incremental
  ```
- **增加线程数**：
  ```bash
  vue-security-scanner --threads 8
  ```
- **排除不需要的目录**：
  ```bash
  vue-security-scanner --exclude node_modules,dist,build
  ```
- **使用快速模式**：
  ```bash
  vue-security-scanner --quick
  ```

### 2.2 误报问题

**问题**：扫描结果中存在误报。

**解决方案**：
- **配置规则严重性**：
  ```javascript
  // .vue-security-scanner.config.js
  module.exports = {
    rules: {
      severity: {
        critical: true,
        high: true,
        medium: false,
        low: false
      }
    }
  };
  ```
- **禁用特定规则**：
  ```javascript
  module.exports = {
    rules: {
      disabled: ['vue:no-raw-html', 'javascript:eval']
    }
  };
  ```
- **添加排除规则**：
  ```javascript
  module.exports = {
    excludePatterns: [
      'src/test/**',
      'src/mock/**'
    ]
  };
  ```
- **报告误报**：将误报报告给项目维护者，帮助改进规则

### 2.3 漏报问题

**问题**：已知的安全问题没有被检测到。

**解决方案**：
- **更新到最新版本**：
  ```bash
  npm update vue-security-scanner
  ```
- **启用所有规则**：
  ```bash
  vue-security-scanner --rules all
  ```
- **检查规则配置**：确保相关规则已启用
  ```javascript
  module.exports = {
    rules: {
      enabled: ['vue', 'javascript', 'dependency', 'china-security']
    }
  };
  ```
- **报告漏报**：将漏报报告给项目维护者，帮助改进规则

### 2.4 扫描命令报错

**问题**：执行扫描命令时出现错误。

**解决方案**：
- **检查命令格式**：确保命令格式正确
  ```bash
  # 正确格式
  vue-security-scanner ./src
  ```
- **查看详细错误**：使用 `--verbose` 选项查看详细错误信息
  ```bash
  vue-security-scanner --verbose
  ```
- **检查配置文件**：确保配置文件格式正确
  ```bash
  vue-security-scanner --validate-config
  ```
- **检查项目结构**：确保扫描目录存在且可访问

### 2.5 报告生成失败

**问题**：生成报告时失败。

**解决方案**：
- **检查输出目录权限**：确保输出目录存在且可写
- **使用绝对路径**：
  ```bash
  vue-security-scanner --output /path/to/report.html
  ```
- **检查报告格式**：确保指定的报告格式支持
  ```bash
  # 支持的格式：text, json, html, xml, sarif
  vue-security-scanner --format html
  ```
- **检查扫描结果**：确保扫描成功生成结果

## 3. 规则问题

### 3.1 规则配置不生效

**问题**：修改规则配置后，配置不生效。

**解决方案**：
- **检查配置文件路径**：确保配置文件在正确的位置
  ```bash
  # 配置文件应该在项目根目录
  ./.vue-security-scanner.config.js
  ```
- **验证配置文件**：使用 `--validate-config` 选项验证配置
  ```bash
  vue-security-scanner --validate-config
  ```
- **重启终端**：修改配置后重启终端
- **使用 --config 选项**：明确指定配置文件路径
  ```bash
  vue-security-scanner --config /path/to/config.js
  ```

### 3.2 自定义规则不工作

**问题**：添加的自定义规则不工作。

**解决方案**：
- **检查规则格式**：确保自定义规则格式正确
  ```javascript
  // 自定义规则格式示例
  module.exports = {
    id: 'custom-rule',
    name: '自定义规则',
    description: '自定义规则描述',
    severity: 'medium',
    patterns: [
      /unsafe-pattern/g
    ],
    fix: '使用安全的替代方案'
  };
  ```
- **检查规则路径**：确保规则文件路径正确
- **启用自定义规则**：在配置中启用自定义规则
  ```javascript
  module.exports = {
    rules: {
      customRules: ['./path/to/custom-rules.js']
    }
  };
  ```
- **查看规则日志**：使用 `--debug` 选项查看规则加载日志
  ```bash
  vue-security-scanner --debug
  ```

### 3.3 规则冲突

**问题**：不同规则之间存在冲突。

**解决方案**：
- **调整规则优先级**：在配置中设置规则优先级
  ```javascript
  module.exports = {
    rules: {
      priority: {
        'vue:no-raw-html': 10,
        'javascript:eval': 5
      }
    }
  };
  ```
- **禁用冲突规则**：禁用相互冲突的规则
  ```javascript
  module.exports = {
    rules: {
      disabled: ['rule1', 'rule2']
    }
  };
  ```
- **报告冲突**：将规则冲突报告给项目维护者

### 3.4 规则更新问题

**问题**：规则没有自动更新。

**解决方案**：
- **更新到最新版本**：
  ```bash
  npm update vue-security-scanner
  ```
- **手动更新规则**：
  ```bash
  vue-security-scanner --update-rules
  ```
- **检查网络连接**：确保网络连接正常，能够访问规则更新源
- **清理规则缓存**：
  ```bash
  vue-security-scanner --clear-rule-cache
  ```

## 4. 性能问题

### 4.1 内存占用高

**问题**：扫描时内存占用过高，导致系统卡顿或崩溃。

**解决方案**：
- **设置内存限制**：
  ```javascript
  module.exports = {
    performance: {
      memoryLimit: 512 * 1024 * 1024 // 512MB
    }
  };
  ```
- **减少线程数**：
  ```bash
  vue-security-scanner --threads 4
  ```
- **分批扫描**：将大型项目分成多个部分扫描
  ```bash
  vue-security-scanner ./src/components
  vue-security-scanner ./src/views
  ```
- **启用内存监控**：
  ```bash
  vue-security-scanner --memory-monitor
  ```

### 4.2 缓存问题

**问题**：缓存导致扫描结果不准确。

**解决方案**：
- **清理缓存**：
  ```bash
  vue-security-scanner --clear-cache
  ```
- **禁用缓存**：
  ```bash
  vue-security-scanner --no-cache
  ```
- **调整缓存时间**：
  ```javascript
  module.exports = {
    performance: {
      cache: {
        ttl: 3600000 // 1小时
      }
    }
  };
  ```

### 4.3 增量扫描问题

**问题**：增量扫描没有检测到所有更改。

**解决方案**：
- **清理扫描历史**：
  ```bash
  rm ./.vue-security-scan-history.json
  ```
- **禁用增量扫描**：
  ```bash
  vue-security-scanner --no-incremental
  ```
- **检查文件系统**：确保文件系统正确报告文件更改
- **使用完整扫描**：定期执行完整扫描
  ```bash
  vue-security-scanner --full-scan
  ```

## 5. 威胁情报问题

### 5.1 威胁情报更新失败

**问题**：威胁情报数据库更新失败。

**解决方案**：
- **检查网络连接**：确保网络连接正常
- **使用代理**：
  ```bash
  # 设置代理
  export HTTP_PROXY=http://proxy.example.com:8080
  export HTTPS_PROXY=http://proxy.example.com:8080
  vue-security-scanner --threat-intelligence --update
  ```
- **调整更新源**：在配置中调整威胁情报源
  ```javascript
  module.exports = {
    threatIntelligence: {
      sources: {
        cncert: true,
        cnnvd: true,
        nvd: true,
        cve: true
      }
    }
  };
  ```
- **手动更新**：
  ```bash
  vue-security-scanner --threat-intelligence --update --force
  ```

### 5.2 威胁情报误报

**问题**：威胁情报报告了不存在的威胁。

**解决方案**：
- **验证威胁情报**：手动验证威胁情报的准确性
- **调整严重性阈值**：
  ```javascript
  module.exports = {
    threatIntelligence: {
      severityThreshold: 'high'
    }
  };
  ```
- **禁用特定情报源**：
  ```javascript
  module.exports = {
    threatIntelligence: {
      sources: {
        'exploit-db': false
      }
    }
  };
  ```
- **报告误报**：将误报报告给项目维护者

### 5.3 威胁情报漏报

**问题**：已知的安全威胁没有被检测到。

**解决方案**：
- **更新威胁情报**：
  ```bash
  vue-security-scanner --threat-intelligence --update
  ```
- **启用更多情报源**：
  ```javascript
  module.exports = {
    threatIntelligence: {
      sources: {
        cncert: true,
        cnnvd: true,
        cnvd: true,
        nvd: true,
        cve: true,
        owasp: true
      }
    }
  };
  ```
- **检查依赖版本**：确保依赖版本信息正确
- **报告漏报**：将漏报报告给项目维护者

## 6. 合规性问题

### 6.1 合规性报告生成失败

**问题**：生成合规性报告时失败。

**解决方案**：
- **检查合规性配置**：确保合规性配置正确
  ```javascript
  module.exports = {
    compliance: {
      standard: 'china',
      report: {
        format: 'html',
        outputPath: './compliance-report.html'
      }
    }
  };
  ```
- **更新威胁情报**：确保威胁情报数据库是最新的
  ```bash
  vue-security-scanner --threat-intelligence --update
  ```
- **检查网络连接**：确保能够访问合规性标准数据
- **使用默认配置**：尝试使用默认合规性配置
  ```bash
  vue-security-scanner --compliance china
  ```

### 6.2 合规性检查不准确

**问题**：合规性检查结果不准确。

**解决方案**：
- **更新到最新版本**：
  ```bash
  npm update vue-security-scanner
  ```
- **使用正确的合规性标准**：
  ```bash
  # 中国合规性标准
  vue-security-scanner --compliance china
  
  # 国际合规性标准
  vue-security-scanner --compliance international
  ```
- **检查规则配置**：确保相关规则已启用
  ```javascript
  module.exports = {
    rules: {
      enabled: ['vue', 'javascript', 'dependency', 'china-security']
    }
  };
  ```
- **报告问题**：将合规性检查问题报告给项目维护者

### 6.3 合规性文档缺失

**问题**：合规性报告中缺少必要的文档。

**解决方案**：
- **检查项目文档**：确保项目中包含必要的合规性文档
- **生成合规性文档**：
  ```bash
  vue-security-scanner --generate-compliance-docs
  ```
- **手动添加文档**：根据合规性标准要求，手动添加必要的文档
- **咨询合规性专家**：如果不确定需要哪些文档，咨询合规性专家

## 7. API 问题

### 7.1 API 调用失败

**问题**：使用 API 时调用失败。

**解决方案**：
- **检查 API 版本**：确保使用的 API 版本与安装的版本匹配
- **检查参数格式**：确保 API 参数格式正确
  ```javascript
  // 正确的 API 调用示例
  const scanner = new VueSecurityScanner({
    scanPath: './src',
    rules: {
      enabled: ['vue', 'javascript']
    }
  });
  ```
- **查看 API 文档**：参考 API 文档中的示例
- **启用调试模式**：
  ```javascript
  const scanner = new VueSecurityScanner({
    debug: true
  });
  ```

### 7.2 API 文档不完整

**问题**：API 文档不完整，缺少某些方法的说明。

**解决方案**：
- **查看源代码**：查看源代码中的 API 实现
- **使用 TypeScript**：使用 TypeScript 获取类型提示
- **报告文档问题**：将文档问题报告给项目维护者
- **贡献文档**：帮助完善 API 文档

### 7.3 API 性能问题

**问题**：使用 API 时性能不佳。

**解决方案**：
- **使用缓存**：
  ```javascript
  const scanner = new VueSecurityScanner({
    performance: {
      cache: {
        enabled: true
      }
    }
  });
  ```
- **使用增量扫描**：
  ```javascript
  const scanner = new VueSecurityScanner({
    performance: {
      enableIncremental: true
    }
  });
  ```
- **优化调用方式**：避免重复创建扫描器实例
  ```javascript
  // 错误方式
  for (const path of paths) {
    const scanner = new VueSecurityScanner({ scanPath: path });
    await scanner.scan();
  }
  
  // 正确方式
  const scanner = new VueSecurityScanner();
  for (const path of paths) {
    scanner.options.scanPath = path;
    await scanner.scan();
  }
  ```

## 8. CI/CD 集成问题

### 8.1 CI/CD 构建失败

**问题**：在 CI/CD 中集成时构建失败。

**解决方案**：
- **使用缓存**：在 CI/CD 中缓存依赖和扫描结果
  ```yaml
  # GitHub Actions 示例
  jobs:
    security-scan:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - uses: actions/setup-node@v2
          with:
            node-version: '16'
        - name: Cache dependencies
          uses: actions/cache@v2
          with:
            path: ~/.npm
            key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
            restore-keys: |
              ${{ runner.os }}-node-
        - name: Cache security scanner
          uses: actions/cache@v2
          with:
            path: ./.vue-security-cache
            key: ${{ runner.os }}-vue-security-${{ github.sha }}
            restore-keys: |
              ${{ runner.os }}-vue-security-
        - run: npm install
        - run: npm run security-scan
  ```
- **调整超时时间**：在 CI/CD 中增加超时时间
- **使用快速模式**：在 CI/CD 中使用快速扫描模式
  ```bash
  vue-security-scanner --quick
  ```
- **设置环境变量**：在 CI/CD 中设置必要的环境变量

### 8.2 CI/CD 扫描结果不一致

**问题**：在 CI/CD 中扫描结果与本地不一致。

**解决方案**：
- **使用相同版本**：确保 CI/CD 中使用的版本与本地相同
- **使用相同配置**：确保 CI/CD 中使用的配置与本地相同
- **禁用缓存**：在 CI/CD 中禁用缓存，确保每次都是完整扫描
  ```bash
  vue-security-scanner --no-cache
  ```
- **检查环境差异**：检查 CI/CD 环境与本地环境的差异

### 8.3 CI/CD 集成配置

**问题**：不知道如何在 CI/CD 中正确配置。

**解决方案**：
- **参考文档**：参考文档中的 CI/CD 集成示例
- **使用模板**：使用项目提供的 CI/CD 模板
- **示例配置**：
  ```yaml
  # GitHub Actions 配置示例
  name: Security Scan
  
  on: [push, pull_request]
  
  jobs:
    security-scan:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - uses: actions/setup-node@v2
          with:
            node-version: '16'
        - run: npm install
        - run: npx vue-security-scanner --format json --output security-results.json
        - name: Upload results
          uses: actions/upload-artifact@v2
          with:
            name: security-results
            path: security-results.json
  ```
  
  ```yaml
  # GitLab CI 配置示例
  security_scan:
    stage: test
    script:
      - npm install
      - npx vue-security-scanner --format html --output security-report.html
    artifacts:
      paths:
        - security-report.html
    only:
      - merge_requests
      - main
  ```

## 9. 其他问题

### 9.1 语言支持问题

**问题**：不支持某些语言或框架。

**解决方案**：
- **检查支持的语言**：查看文档中支持的语言列表
- **使用自定义规则**：为不支持的语言创建自定义规则
- **请求支持**：向项目维护者请求添加对特定语言的支持
- **贡献代码**：帮助添加对新语言的支持

### 9.2 配置文件问题

**问题**：配置文件不生效或格式错误。

**解决方案**：
- **验证配置文件**：
  ```bash
  vue-security-scanner --validate-config
  ```
- **查看配置示例**：参考文档中的配置示例
- **使用默认配置**：删除配置文件，使用默认配置
- **检查语法错误**：确保配置文件没有语法错误

### 9.3 日志和调试

**问题**：需要查看详细的日志和调试信息。

**解决方案**：
- **启用调试模式**：
  ```bash
  vue-security-scanner --debug
  ```
- **启用详细输出**：
  ```bash
  vue-security-scanner --verbose
  ```
- **查看日志文件**：
  ```bash
  # 查看日志文件
  cat ./.vue-security-cache/scanner.log
  ```
- **设置日志级别**：
  ```javascript
  module.exports = {
    logging: {
      level: 'debug'
    }
  };
  ```

### 9.4 自定义集成

**问题**：需要与其他工具或系统集成。

**解决方案**：
- **使用 API**：使用 API 与其他工具集成
- **使用输出格式**：使用机器可读的输出格式
  ```bash
  vue-security-scanner --format json
  ```
- **使用 webhook**：配置 webhook 发送扫描结果
  ```javascript
  module.exports = {
    reporting: {
      webhook: {
        enabled: true,
        url: 'https://example.com/webhook'
      }
    }
  };
  ```
- **贡献集成**：帮助添加对其他工具的集成支持

### 9.5 许可证问题

**问题**：关于项目许可证的疑问。

**解决方案**：
- **查看 LICENSE 文件**：项目根目录中的 LICENSE 文件包含详细的许可证信息
- **咨询法律顾问**：如果对许可证有疑问，咨询法律顾问
- **遵守许可证**：确保在使用和修改项目时遵守许可证要求

### 9.6 社区支持

**问题**：需要社区支持和帮助。

**解决方案**：
- **GitHub Issues**：在 GitHub Issues 中提问
- **Discord 社区**：加入 Discord 社区寻求帮助
- **Stack Overflow**：在 Stack Overflow 上提问，使用 `vue-security-scanner` 标签
- **邮件列表**：加入项目邮件列表
- **贡献者**：联系项目贡献者寻求帮助

## 10. 联系支持

如果您遇到的问题在本 FAQ 中没有得到解答，可以通过以下方式联系支持：

### 10.1 GitHub Issues

- **创建 Issue**：在 GitHub 上创建新的 Issue
  [https://github.com/vue-security-scanner/vue-security-scanner/issues](https://github.com/vue-security-scanner/vue-security-scanner/issues)
- **问题模板**：使用提供的问题模板，包含详细的问题描述和环境信息

### 10.2 Discord 社区

- **加入 Discord**：[https://discord.gg/vue-security](https://discord.gg/vue-security)
- **支持频道**：在 `#support` 频道中提问
- **社区成员**：社区成员和贡献者会尽力回答您的问题

### 10.3 邮件支持

- **发送邮件**：contact@vue-security-scanner.com
- **邮件内容**：包含详细的问题描述、环境信息和重现步骤
- **回复时间**：通常会在 1-3 个工作日内回复

### 10.4 企业支持

对于企业用户，我们提供专业的技术支持服务：

- **企业级支持**：优先处理企业用户的问题
- **定制化服务**：根据企业需求提供定制化服务
- **安全咨询**：提供专业的安全咨询服务
- **培训服务**：提供安全扫描培训服务

## 11. 故障排除指南

### 11.1 基本故障排除步骤

1. **检查版本**：确保使用的是最新版本
   ```bash
   vue-security-scanner --version
   ```

2. **运行诊断**：运行诊断命令检查系统状态
   ```bash
   vue-security-scanner --diagnose
   ```

3. **查看日志**：查看扫描日志
   ```bash
   vue-security-scanner --verbose
   ```

4. **检查环境**：检查系统环境和依赖
   ```bash
   node -v
   npm -v
   ```

5. **尝试默认配置**：使用默认配置运行
   ```bash
   vue-security-scanner --default-config
   ```

### 11.2 常见错误代码

| 错误代码 | 描述 | 解决方案 |
|----------|------|----------|
| `E001` | 扫描路径不存在 | 检查扫描路径是否存在 |
| `E002` | 配置文件格式错误 | 检查配置文件语法 |
| `E003` | 依赖项缺失 | 重新安装依赖 |
| `E004` | 内存不足 | 增加内存限制或减少线程数 |
| `E005` | 网络连接失败 | 检查网络连接 |
| `E006` | 规则加载失败 | 检查规则配置 |
| `E007` | 报告生成失败 | 检查输出目录权限 |
| `E008` | API 调用失败 | 检查 API 参数 |

### 11.3 高级故障排除

**如果基本故障排除步骤无法解决问题，可以尝试以下高级故障排除方法：**

1. **启用完整调试**：
   ```bash
   vue-security-scanner --debug --verbose --log-file debug.log
   ```

2. **使用 strace (Linux)**：
   ```bash
   strace -f -o strace.log vue-security-scanner
   ```

3. **使用 Process Monitor (Windows)**：
   - 下载并运行 Process Monitor
   - 过滤 `vue-security-scanner` 进程
   - 查看详细的系统调用

4. **创建最小复现案例**：
   - 创建一个最小的项目，能够重现问题
   - 提供给项目维护者，帮助他们诊断问题

5. **提交完整的错误报告**：
   - 包含错误信息、日志、环境信息
   - 包含重现步骤和最小复现案例
   - 包含预期行为和实际行为

## 12. 总结

本 FAQ 涵盖了 Vue Security Scanner 的常见问题和解决方案。如果您遇到的问题在本 FAQ 中没有得到解答，或者您有任何建议和反馈，请通过上述联系方式联系我们。

我们致力于不断改进 Vue Security Scanner，为您提供更安全、更高效的 Vue 应用开发体验。您的反馈对我们非常重要，帮助我们不断完善产品。

感谢您使用 Vue Security Scanner！