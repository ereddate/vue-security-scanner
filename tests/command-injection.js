// Command Injection 漏洞示例文件

import { exec, spawn, execFile, execSync } from 'child_process';
import { spawnSync } from 'child_process';

// 示例 1: 直接使用用户输入执行命令
export function commandInjectionExample1(userInput) {
  // 危险：直接将用户输入拼接到命令中
  return exec(`ls ${userInput}`, (error, stdout, stderr) => {
    return stdout;
  });
}

// 示例 2: 使用 spawn 执行命令
export function commandInjectionExample2(command) {
  // 危险：使用用户提供的命令
  const child = spawn(command, [], { shell: true });
  return child;
}

// 示例 3: 执行带参数的命令
export function commandInjectionExample3(filePath) {
  // 危险：用户输入直接用于命令参数
  return execSync(`cat ${filePath}`);
}

// 示例 4: 使用 execFile 执行命令
export function commandInjectionExample4(fileName) {
  // 危险：用户输入影响文件名
  return execFile('ls', ['-la', fileName], (error, stdout, stderr) => {
    return stdout;
  });
}

// 示例 5: 不安全的命令构造
export function commandInjectionExample5(directory) {
  // 危险：直接插入用户输入到命令中
  const cmd = `find ${directory} -name "*.txt"`;
  return exec(cmd);
}

// 示例 6: 使用模板字符串构建命令
export function commandInjectionExample6(target) {
  // 危险：用户输入通过模板字符串插入
  const result = execSync(`ping -c 4 ${target}`);
  return result.toString();
}

// 示例 7: 不安全的参数传递
export function commandInjectionExample7(args) {
  // 危险：用户提供的参数未经验证
  return spawn('curl', args, { shell: true });
}

// 示例 8: 构造复杂的命令管道
export function commandInjectionExample8(filter) {
  // 危险：过滤器参数直接插入命令
  const cmd = `ps aux | grep "${filter}" | awk '{print $2}'`;
  return execSync(cmd).toString();
}

// 示例 9: 文件操作命令注入
export function commandInjectionExample9(fileName) {
  // 危险：用户指定的文件名直接用于命令
  return exec(`rm -f ${fileName}`, (error, stdout, stderr) => {
    return error ? error.message : 'Success';
  });
}

// 示例 10: 使用环境变量的命令
export function commandInjectionExample10(userPath) {
  // 危险：用户输入影响路径
  process.env.USER_PATH = userPath;
  return execSync(`ls $USER_PATH`);
}

// 示例 11: 系统信息查询命令注入
export function commandInjectionExample11(interfaceName) {
  // 危险：网络接口名称来自用户输入
  return exec(`ifconfig ${interfaceName}`, (error, stdout, stderr) => {
    return stdout;
  });
}

// 示例 12: 不安全的命令链
export function commandInjectionExample12(command) {
  // 危险：用户命令可能包含特殊字符
  const cmd = `echo "${command}" | sh`;
  return execSync(cmd);
}

// 示例 13: 包管理器命令注入
export function commandInjectionExample13(packageName) {
  // 危险：包名来自用户输入
  return exec(`npm install ${packageName}`, (error, stdout, stderr) => {
    return stdout;
  });
}

// 示例 14: 不安全的文本处理命令
export function commandInjectionExample14(searchTerm, filePath) {
  // 危险：搜索词和文件路径都来自用户
  const cmd = `grep "${searchTerm}" ${filePath}`;
  return execSync(cmd).toString();
}

// 示例 15: 使用 spawnSync 执行命令
export function commandInjectionExample15(action, target) {
  // 危险：action 和 target 都来自用户输入
  const result = spawnSync(action, [target], { shell: true });
  return result.stdout.toString();
}

// 示例 16: 不安全的压缩命令
export function commandInjectionExample16(archiveName, files) {
  // 危险：存档名和文件列表来自用户输入
  const cmd = `tar -czf ${archiveName} ${files}`;
  return execSync(cmd);
}

// 示例 17: 不安全的数据库命令
export function commandInjectionExample17(dbName, query) {
  // 危险：数据库名和查询来自用户输入
  const cmd = `mysql -e "${query}" ${dbName}`;
  return execSync(cmd).toString();
}

// 示例 18: 系统权限命令注入
export function commandInjectionExample18(serviceName) {
  // 危险：服务名来自用户输入
  return exec(`sudo systemctl start ${serviceName}`, (error, stdout, stderr) => {
    return stdout;
  });
}

// 示例 19: 不安全的 Git 命令
export function commandInjectionExample19(repoUrl) {
  // 危险：仓库 URL 来自用户输入
  const cmd = `git clone ${repoUrl}`;
  return execSync(cmd);
}

// 示例 20: 使用反引号的命令注入
export function commandInjectionExample20(userInput) {
  // 危险：使用模板字面量执行命令
  return execSync(`echo ${userInput} | sort | uniq`);
}
