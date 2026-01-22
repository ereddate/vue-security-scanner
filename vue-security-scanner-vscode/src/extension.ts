import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';

// 用于存储安全问题的诊断集合
let diagnosticCollection: vscode.DiagnosticCollection;

// 扫描结果面板
let reportPanel: vscode.WebviewPanel | undefined;

/**
 * 激活插件
 */
export function activate(context: vscode.ExtensionContext) {
	console.log('Vue Security Scanner extension activated');

	// 创建诊断集合
	diagnosticCollection = vscode.languages.createDiagnosticCollection('vue-security');

	// 注册命令
	const scanProjectCommand = vscode.commands.registerCommand('vue-security-scanner.scanProject', () => {
		scanProject();
	});

	const scanCurrentFileCommand = vscode.commands.registerCommand('vue-security-scanner.scanCurrentFile', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			scanFile(editor.document.fileName);
		} else {
			vscode.window.showInformationMessage('No active editor found');
		}
	});

	const showReportCommand = vscode.commands.registerCommand('vue-security-scanner.showReport', () => {
		showSecurityReport();
	});

	const configureSettingsCommand = vscode.commands.registerCommand('vue-security-scanner.configureSettings', () => {
		vscode.commands.executeCommand('workbench.action.openSettings', 'vueSecurityScanner');
	});

	// 添加到上下文
	context.subscriptions.push(scanProjectCommand);
	context.subscriptions.push(scanCurrentFileCommand);
	context.subscriptions.push(showReportCommand);
	context.subscriptions.push(configureSettingsCommand);

	// 监听文件保存事件（如果启用了保存时扫描）
	if (vscode.workspace.getConfiguration('vueSecurityScanner').get('scanOnSave')) {
		context.subscriptions.push(
			vscode.workspace.onDidSaveTextDocument(document => {
				if (document.languageId === 'vue') {
					scanFile(document.fileName);
				}
			})
		);
	}

	// 监听文件打开事件（如果启用了打开时扫描）
	if (vscode.workspace.getConfiguration('vueSecurityScanner').get('enableOnOpen')) {
		context.subscriptions.push(
			vscode.workspace.onDidOpenTextDocument(document => {
				if (document.languageId === 'vue') {
					scanFile(document.fileName);
				}
			})
		);
	}

	// 初始化时检查是否需要扫描整个项目
	setTimeout(() => {
		if (vscode.workspace.workspaceFolders) {
			const workspaceFolder = vscode.workspace.workspaceFolders[0];
			const packageJsonPath = path.join(workspaceFolder.uri.fsPath, 'package.json');
			
			if (fs.existsSync(packageJsonPath)) {
				// 检查是否是Vue项目
				const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
				if (packageJson.dependencies && 
					(packageJson.dependencies['vue'] || packageJson.devDependencies && packageJson.devDependencies['vue'])) {
					
					// 询问用户是否要扫描整个项目
					vscode.window.showInformationMessage(
						'Detected a Vue.js project. Would you like to run a security scan?',
						'Scan Now', 'Later'
					).then(selection => {
						if (selection === 'Scan Now') {
							scanProject();
						}
					});
				}
			}
		}
	}, 3000); // 延迟3秒执行，等待VSCode完全加载
}

/**
 * 扫描整个项目
 */
async function scanProject() {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) {
		vscode.window.showErrorMessage('No workspace folder found');
		return;
	}

	vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: "Scanning Vue project for security issues...",
		cancellable: true
	}, async (progress, token) => {
		progress.report({ increment: 0, message: "Initializing..." });
		
		try {
			// 这里我们需要调用Vue安全扫描器
			// 由于当前项目还未发布到npm，我们暂时使用本地路径
			const projectPath = workspaceFolder.uri.fsPath;
			
			// 检查vue-security-scanner是否已安装
			const scannerModulePath = path.join(__dirname, '..', '..', '..');
			
			// 导入扫描器
			const { SecurityScanner } = await import(scannerModulePath + '/src/scanner');
			const scanner = new SecurityScanner.SecurityScanner();
			
			progress.report({ increment: 30, message: "Scanning files..." });
			
			// 执行扫描
			const results = await scanner.scanVueProject(projectPath);
			
			progress.report({ increment: 70, message: "Processing results..." });
			
			// 处理扫描结果
			processScanResults(results);
			
			progress.report({ increment: 100, message: "Scan completed!" });
			
			vscode.window.showInformationMessage(
				`Security scan completed! Found ${results.vulnerabilities.length} vulnerabilities.`
			);
			
		} catch (error) {
			console.error('Error during security scan:', error);
			vscode.window.showErrorMessage(`Security scan failed: ${error instanceof Error ? error.message : String(error)}`);
		}
	});
}

/**
 * 扫描单个文件
 */
async function scanFile(filePath: string) {
	if (!filePath.endsWith('.vue')) {
		vscode.window.showInformationMessage('Security scan only available for .vue files');
		return;
	}

	vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: "Scanning file for security issues...",
		cancellable: true
	}, async (progress, token) => {
		progress.report({ increment: 0, message: "Loading file..." });
		
		try {
			// 读取文件内容
			const content = fs.readFileSync(filePath, 'utf-8');
			
			progress.report({ increment: 30, message: "Analyzing content..." });
			
			// 导入扫描器
			const scannerModulePath = path.join(__dirname, '..', '..', '..');
			const { SecurityScanner } = await import(scannerModulePath + '/src/scanner');
			const scanner = new SecurityScanner.SecurityScanner();
			
			progress.report({ increment: 60, message: "Running security checks..." });
			
			// 扫描单个文件
			const vulnerabilities = await scanner.detector.detectVulnerabilities(filePath, content);
			
			progress.report({ increment: 90, message: "Processing results..." });
			
			// 显示结果
			if (vulnerabilities.length > 0) {
				vscode.window.showWarningMessage(
					`Found ${vulnerabilities.length} security issues in ${path.basename(filePath)}`
				);
				
				// 更新诊断信息
				updateDiagnostics(filePath, vulnerabilities);
			} else {
				vscode.window.showInformationMessage(
					`No security issues found in ${path.basename(filePath)}`
				);
				
				// 清除之前的诊断信息
				diagnosticCollection.set(vscode.Uri.file(filePath), []);
			}
			
			progress.report({ increment: 100, message: "Scan completed!" });
			
		} catch (error) {
			console.error('Error during file scan:', error);
			vscode.window.showErrorMessage(`File scan failed: ${error instanceof Error ? error.message : String(error)}`);
		}
	});
}

/**
 * 处理扫描结果并更新诊断
 */
function processScanResults(results: any) {
	// 清除之前的诊断
	diagnosticCollection.clear();
	
	// 按文件分组漏洞
	const vulnerabilitiesByFile: { [key: string]: any[] } = {};
	
	results.vulnerabilities.forEach((vuln: any) => {
		if (!vulnerabilitiesByFile[vuln.file]) {
			vulnerabilitiesByFile[vuln.file] = [];
		}
		vulnerabilitiesByFile[vuln.file].push(vuln);
	});
	
	// 为每个文件更新诊断
	Object.keys(vulnerabilitiesByFile).forEach(filePath => {
		const vulns = vulnerabilitiesByFile[filePath];
		updateDiagnostics(filePath, vulns);
	});
}

/**
 * 更新诊断信息
 */
function updateDiagnostics(filePath: string, vulnerabilities: any[]) {
	const diagnostics: vscode.Diagnostic[] = [];
	const documentUri = vscode.Uri.file(filePath);
	
	// 尝试获取文档以便精确定位
	let document: vscode.TextDocument | undefined;
	try {
		document = vscode.workspace.textDocuments.find(doc => doc.fileName === filePath);
	} catch (e) {
		// 如果找不到文档，使用文件系统读取
	}
	
	vulnerabilities.forEach(vuln => {
		// 创建诊断对象
		const diagnostic = new vscode.Diagnostic(
			new vscode.Range(
				new vscode.Position(Math.max(0, (vuln.line || 1) - 1), 0),
				new vscode.Position(Math.max(0, (vuln.line || 1) - 1), 100)
			),
			`${vuln.type}: ${vuln.description}`,
			getSeverity(vuln.severity)
		);
		
		// 添加详细信息
		diagnostic.source = 'Vue Security Scanner';
		diagnostic.code = vuln.plugin || 'builtin';
		
		// 添加悬停提示
		const hoverMessage = new vscode.MarkdownString();
		hoverMessage.appendMarkdown(`**${vuln.type}**\n\n`);
		hoverMessage.appendMarkdown(`${vuln.description}\n\n`);
		hoverMessage.appendMarkdown(`---\n`);
		hoverMessage.appendMarkdown(`**Recommendation:** ${vuln.recommendation}\n\n`);
		if (vuln.plugin) {
			hoverMessage.appendMarkdown(`**Detected by:** ${vuln.plugin}\n`);
		}
		
		diagnostic.message = hoverMessage.value;
		
		diagnostics.push(diagnostic);
	});
	
	// 设置诊断
	diagnosticCollection.set(documentUri, diagnostics);
}

/**
 * 将安全级别转换为VSCode诊断级别
 */
function getSeverity(severity: string): vscode.DiagnosticSeverity {
	switch (severity.toLowerCase()) {
		case 'critical':
		case 'high':
			return vscode.DiagnosticSeverity.Error;
		case 'medium':
			return vscode.DiagnosticSeverity.Warning;
		case 'low':
			return vscode.DiagnosticSeverity.Information;
		default:
			return vscode.DiagnosticSeverity.Warning;
	}
}

/**
 * 显示安全报告面板
 */
function showSecurityReport() {
	if (reportPanel) {
		reportPanel.reveal(vscode.ViewColumn.One);
	} else {
		reportPanel = vscode.window.createWebviewPanel(
			'vueSecurityReport',
			'Vue Security Report',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true
			}
		);

		// 设置初始HTML内容
		reportPanel.webview.html = getReportWebviewContent();

		// 当面板关闭时清除引用
		reportPanel.onDidDispose(() => {
			reportPanel = undefined;
		}, null, []);
	}
}

/**
 * 获取报告面板的HTML内容
 */
function getReportWebviewContent(): string {
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Vue Security Report</title>
			<style>
				body {
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', 'Ubuntu', 'Droid Sans', sans-serif;
					padding: 20px;
				}
				.header {
					border-bottom: 1px solid #ccc;
					padding-bottom: 10px;
					margin-bottom: 20px;
				}
				.vulnerability {
					border: 1px solid #ddd;
					border-radius: 4px;
					padding: 10px;
					margin-bottom: 10px;
				}
				.high { border-left: 4px solid #ff0000; }
				.medium { border-left: 4px solid #ffa500; }
				.low { border-left: 4px solid #ffff00; }
				.type { font-weight: bold; margin-bottom: 5px; }
				.file { color: #666; font-size: 0.9em; margin-bottom: 5px; }
				.description { margin: 10px 0; }
				.recommendation { background-color: #f0f8ff; padding: 8px; border-radius: 3px; }
			</style>
		</head>
		<body>
			<div class="header">
				<h1>Vue Security Report</h1>
				<p>Security scan results for the current project</p>
			</div>
			<div id="report-content">
				<p>No scan results available. Run a security scan to see results here.</p>
			</div>
			
			<script>
				const vscode = acquireVsCodeApi();
				
				// 监听来自扩展的消息
				window.addEventListener('message', event => {
					const message = event.data;
					switch (message.command) {
						case 'updateReport':
							updateReport(message.results);
							break;
					}
				});
				
				function updateReport(results) {
					const contentDiv = document.getElementById('report-content');
					
					if (results.vulnerabilities && results.vulnerabilities.length > 0) {
						let html = '';
						
						html += '<h2>Summary</h2>';
						html += '<ul>';
						html += '<li>Total vulnerabilities: ' + results.vulnerabilities.length + '</li>';
						html += '<li>Files scanned: ' + (results.scanStats?.filesScanned || 'N/A') + '</li>';
						html += '<li>Scan date: ' + new Date().toLocaleString() + '</li>';
						html += '</ul>';
						
						html += '<h2>Detected Vulnerabilities</h2>';
						
						results.vulnerabilities.forEach(vuln => {
							const severityClass = vuln.severity.toLowerCase();
							html += '<div class="vulnerability ' + severityClass + '">';
							html += '<div class="type">' + vuln.severity + ': ' + vuln.type + '</div>';
							html += '<div class="file">File: ' + vuln.file + (vuln.line ? ':' + vuln.line : '') + '</div>';
							html += '<div class="description">' + vuln.description + '</div>';
							html += '<div class="recommendation"><strong>Recommendation:</strong> ' + vuln.recommendation + '</div>';
							if (vuln.plugin) {
								html += '<div><small>Detected by: ' + vuln.plugin + '</small></div>';
							}
							html += '</div>';
						});
						
						contentDiv.innerHTML = html;
					} else {
						contentDiv.innerHTML = '<p>No vulnerabilities detected in the project.</p>';
					}
				}
			</script>
		</body>
		</html>
	`;
}

/**
 * 停用插件
 */
export function deactivate() {
	console.log('Vue Security Scanner extension deactivated');
	if (reportPanel) {
		reportPanel.dispose();
	}
	diagnosticCollection.clear();
}