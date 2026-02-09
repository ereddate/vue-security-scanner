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

	const showAdvancedReportCommand = vscode.commands.registerCommand('vue-security-scanner.showAdvancedReport', () => {
		showAdvancedSecurityReport();
	});

	const scanDependenciesCommand = vscode.commands.registerCommand('vue-security-scanner.scanDependencies', () => {
		scanDependencies();
	});

	const configureSettingsCommand = vscode.commands.registerCommand('vue-security-scanner.configureSettings', () => {
		vscode.commands.executeCommand('workbench.action.openSettings', 'vueSecurityScanner');
	});

	// 添加到上下文
	context.subscriptions.push(scanProjectCommand);
	context.subscriptions.push(scanCurrentFileCommand);
	context.subscriptions.push(showReportCommand);
	context.subscriptions.push(showAdvancedReportCommand);
	context.subscriptions.push(scanDependenciesCommand);
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
	}, async (progress, _token) => {
		progress.report({ increment: 0, message: "Initializing..." });
		
		try {
			// 这里我们需要调用Vue安全扫描器
			// 由于当前项目还未发布到npm，我们暂时使用本地路径
			const projectPath = workspaceFolder.uri.fsPath;
			
			// 检查vue-security-scanner是否已安装
			const scannerModulePath = path.join(__dirname, '..', '..', '..');
			
			// 导入扫描器
			const { SecurityScanner } = await import(scannerModulePath + '/src/scanner');
			const scanner = new SecurityScanner({
				performance: {
					enableSemanticAnalysis: vscode.workspace.getConfiguration('vueSecurityScanner').get('enableSemanticAnalysis', true),
					performanceProfile: vscode.workspace.getConfiguration('vueSecurityScanner').get('performanceProfile', 'balanced'),
					enableCaching: vscode.workspace.getConfiguration('vueSecurityScanner').get('enableCaching', true),
					enableIncrementalScanning: vscode.workspace.getConfiguration('vueSecurityScanner').get('enableIncrementalScanning', true),
					enableParallelProcessing: vscode.workspace.getConfiguration('vueSecurityScanner').get('enableParallelProcessing', true),
					enableGPUAcceleration: vscode.workspace.getConfiguration('vueSecurityScanner').get('enableGPUAcceleration', true)
				}
			});
			
			progress.report({ increment: 30, message: "Scanning files..." });
			
			// 执行扫描
			const results = await scanner.scanProject(projectPath);
			
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
	}, async (progress, _token) => {
		progress.report({ increment: 0, message: "Loading file..." });
		
		try {
			// 读取文件内容
			const content = fs.readFileSync(filePath, 'utf-8');
			
			progress.report({ increment: 30, message: "Analyzing content..." });
			
			// 导入扫描器
			const scannerModulePath = path.join(__dirname, '..', '..', '..');
			const { SecurityScanner } = await import(scannerModulePath + '/src/scanner');
			const scanner = new SecurityScanner({
				performance: {
					enableSemanticAnalysis: vscode.workspace.getConfiguration('vueSecurityScanner').get('enableSemanticAnalysis', true),
					performanceProfile: vscode.workspace.getConfiguration('vueSecurityScanner').get('performanceProfile', 'balanced'),
					enableCaching: vscode.workspace.getConfiguration('vueSecurityScanner').get('enableCaching', true),
					enableIncrementalScanning: vscode.workspace.getConfiguration('vueSecurityScanner').get('enableIncrementalScanning', true),
					enableParallelProcessing: vscode.workspace.getConfiguration('vueSecurityScanner').get('enableParallelProcessing', true),
					enableGPUAcceleration: vscode.workspace.getConfiguration('vueSecurityScanner').get('enableGPUAcceleration', true)
				}
			});
			
			progress.report({ increment: 60, message: "Running security checks..." });
			
			// 扫描单个文件
			const result = await scanner.scanFile(filePath, content);
			const vulnerabilities = result.vulnerabilities || [];
			
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
		diagnostic.code = vuln.ruleId || 'builtin';
		
		// 添加悬停提示
		const hoverMessage = new vscode.MarkdownString();
		hoverMessage.appendMarkdown(`**${vuln.type}**\n\n`);
		hoverMessage.appendMarkdown(`${vuln.description}\n\n`);
		hoverMessage.appendMarkdown(`---\n`);
		hoverMessage.appendMarkdown(`**Recommendation:** ${vuln.recommendation}\n\n`);
		if (vuln.ruleId) {
			hoverMessage.appendMarkdown(`**Rule:** ${vuln.ruleId}\n`);
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
							if (vuln.ruleId) {
								html += '<div><small>Rule: ' + vuln.ruleId + '</small></div>';
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
 * 扫描依赖项
 */
async function scanDependencies() {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) {
		vscode.window.showErrorMessage('No workspace folder found');
		return;
	}

	vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: "Scanning dependencies for vulnerabilities...",
		cancellable: true
	}, async (progress, _token) => {
		progress.report({ increment: 0, message: "Initializing..." });
		
		try {
			const projectPath = workspaceFolder.uri.fsPath;
			const scannerModulePath = path.join(__dirname, '..', '..', '..');
			
			// 导入依赖扫描器
			const DependencyScanner = await import(scannerModulePath + '/src/analysis/dependency-scanner');
			const depScanner = new DependencyScanner.default({
				enableNpmAudit: true,
				enableVulnerabilityDB: true
			});
			
			progress.report({ increment: 30, message: "Running npm audit..." });
			
			// 执行依赖扫描
			const vulnerabilities = await depScanner.scanDependencies(projectPath);
			
			progress.report({ increment: 70, message: "Processing results..." });
			
			// 显示结果
			if (vulnerabilities.length > 0) {
				vscode.window.showWarningMessage(
					`Found ${vulnerabilities.length} dependency vulnerabilities!`
				);
				
				// 显示详细报告
				showDependencyReport(vulnerabilities);
			} else {
				vscode.window.showInformationMessage(
					'No dependency vulnerabilities found!'
				);
			}
			
			progress.report({ increment: 100, message: "Scan completed!" });
			
		} catch (error) {
			console.error('Error during dependency scan:', error);
			vscode.window.showErrorMessage(`Dependency scan failed: ${error instanceof Error ? error.message : String(error)}`);
		}
	});
}

/**
 * 显示依赖漏洞报告
 */
function showDependencyReport(vulnerabilities: any[]) {
	const panel = vscode.window.createWebviewPanel(
		'dependencySecurityReport',
		'Dependency Security Report',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			retainContextWhenHidden: true
		}
	);

	panel.webview.html = getDependencyReportWebviewContent(vulnerabilities);
}

/**
 * 获取依赖报告面板的HTML内容
 */
function getDependencyReportWebviewContent(vulnerabilities: any[]): string {
	const summary = {
		critical: vulnerabilities.filter(v => v.severity === 'Critical').length,
		high: vulnerabilities.filter(v => v.severity === 'High').length,
		medium: vulnerabilities.filter(v => v.severity === 'Medium').length,
		low: vulnerabilities.filter(v => v.severity === 'Low').length
	};

	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Dependency Security Report</title>
			<style>
				body {
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', 'Ubuntu', 'Droid Sans', sans-serif;
					padding: 20px;
					background: #f5f5f5;
				}
				.container {
					max-width: 1200px;
					margin: 0 auto;
					background: white;
					padding: 20px;
					border-radius: 8px;
				}
				.header {
					border-bottom: 1px solid #ccc;
					padding-bottom: 10px;
					margin-bottom: 20px;
				}
				.summary {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
					gap: 15px;
					margin: 20px 0;
				}
				.summary-card {
					padding: 15px;
					border-radius: 5px;
					color: white;
				}
				.critical { background: #d32f2f; }
				.high { background: #f57c00; }
				.medium { background: #fbc02d; }
				.low { background: #388e3c; }
				.vulnerability {
					border: 1px solid #ddd;
					padding: 15px;
					margin: 10px 0;
					border-radius: 5px;
				}
				.vulnerability.critical { border-left: 5px solid #d32f2f; }
				.vulnerability.high { border-left: 5px solid #f57c00; }
				.vulnerability.medium { border-left: 5px solid #fbc02d; }
				.vulnerability.low { border-left: 5px solid #388e3c; }
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">
					<h1>🔒 Dependency Security Report</h1>
					<p>Generated: ${new Date().toISOString()}</p>
				</div>
				
				<div class="summary">
					<div class="summary-card critical">
						<h3>Critical</h3>
						<p>${summary.critical}</p>
					</div>
					<div class="summary-card high">
						<h3>High</h3>
						<p>${summary.high}</p>
					</div>
					<div class="summary-card medium">
						<h3>Medium</h3>
						<p>${summary.medium}</p>
					</div>
					<div class="summary-card low">
						<h3>Low</h3>
						<p>${summary.low}</p>
					</div>
				</div>
				
				<h2>Vulnerabilities (${vulnerabilities.length})</h2>
				${vulnerabilities.map(vuln => `
					<div class="vulnerability ${vuln.severity.toLowerCase()}">
						<h3>${vuln.type} - ${vuln.severity}</h3>
						<p><strong>Package:</strong> ${vuln.package || vuln.file}</p>
						<p><strong>Description:</strong> ${vuln.description}</p>
						<p><strong>Recommendation:</strong> ${vuln.recommendation}</p>
					</div>
				`).join('')}
			</div>
		</body>
		</html>
	`;
}

/**
 * 显示高级安全报告
 */
async function showAdvancedSecurityReport() {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) {
		vscode.window.showErrorMessage('No workspace folder found');
		return;
	}

	vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: "Generating advanced security report...",
		cancellable: true
	}, async (progress, _token) => {
		progress.report({ increment: 0, message: "Scanning project..." });
		
		try {
			const projectPath = workspaceFolder.uri.fsPath;
			const scannerModulePath = path.join(__dirname, '..', '..', '..');
			
			// 导入扫描器和高级报告生成器
			const { SecurityScanner } = await import(scannerModulePath + '/src/scanner');
			const AdvancedReportGenerator = await import(scannerModulePath + '/src/reporting/advanced-report-generator');
			
			const scanner = new SecurityScanner({
				performance: {
					enableSemanticAnalysis: vscode.workspace.getConfiguration('vueSecurityScanner').get('enableSemanticAnalysis', true),
					performanceProfile: vscode.workspace.getConfiguration('vueSecurityScanner').get('performanceProfile', 'balanced'),
					enableCaching: vscode.workspace.getConfiguration('vueSecurityScanner').get('enableCaching', true),
					enableIncrementalScanning: vscode.workspace.getConfiguration('vueSecurityScanner').get('enableIncrementalScanning', true),
					enableParallelProcessing: vscode.workspace.getConfiguration('vueSecurityScanner').get('enableParallelProcessing', true),
					enableGPUAcceleration: vscode.workspace.getConfiguration('vueSecurityScanner').get('enableGPUAcceleration', true)
				}
			});
			
			progress.report({ increment: 30, message: "Scanning files..." });
			
			// 执行扫描
			const scanResults = await scanner.scanProject(projectPath);
			
			progress.report({ increment: 60, message: "Generating advanced report..." });
			
			// 生成高级报告
			const reportGenerator = new AdvancedReportGenerator.default();
			const advancedReport = reportGenerator.generateAdvancedReport(scanResults, {
				includeTrends: true,
				includeCompliance: true,
				historyPath: vscode.workspace.getConfiguration('vueSecurityScanner').get('reportHistoryPath', '.vue-security-reports')
			});
			
			progress.report({ increment: 90, message: "Preparing display..." });
			
			// 显示高级报告
			showAdvancedReportPanel(advancedReport);
			
			progress.report({ increment: 100, message: "Report generated!" });
			
			vscode.window.showInformationMessage('Advanced security report generated successfully!');
			
		} catch (error) {
			console.error('Error generating advanced report:', error);
			vscode.window.showErrorMessage(`Failed to generate advanced report: ${error instanceof Error ? error.message : String(error)}`);
		}
	});
}

/**
 * 显示高级报告面板
 */
function showAdvancedReportPanel(report: any) {
	const panel = vscode.window.createWebviewPanel(
		'advancedSecurityReport',
		'Advanced Security Report',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			retainContextWhenHidden: true
		}
	);

	panel.webview.html = getAdvancedReportWebviewContent(report);
}

/**
 * 获取高级报告面板的HTML内容
 */
function getAdvancedReportWebviewContent(report: any): string {
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Advanced Security Report</title>
			<style>
				body {
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', 'Ubuntu', 'Droid Sans', sans-serif;
					padding: 20px;
					background: #f5f5f5;
				}
				.container {
					max-width: 1200px;
					margin: 0 auto;
					background: white;
					padding: 20px;
					border-radius: 8px;
				}
				.header {
					border-bottom: 1px solid #ccc;
					padding-bottom: 10px;
					margin-bottom: 20px;
				}
				.summary {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
					gap: 15px;
					margin: 20px 0;
				}
				.summary-card {
					padding: 15px;
					border-radius: 5px;
					color: white;
				}
				.critical { background: #d32f2f; }
				.high { background: #f57c00; }
				.medium { background: #fbc02d; }
				.low { background: #388e3c; }
				.vulnerability {
					border: 1px solid #ddd;
					padding: 15px;
					margin: 10px 0;
					border-radius: 5px;
				}
				.vulnerability.critical { border-left: 5px solid #d32f2f; }
				.vulnerability.high { border-left: 5px solid #f57c00; }
				.vulnerability.medium { border-left: 5px solid #fbc02d; }
				.vulnerability.low { border-left: 5px solid #388e3c; }
				.compliance {
					margin-top: 30px;
					padding: 15px;
					background: #e3f2fd;
					border-radius: 5px;
				}
				.trends {
					margin-top: 30px;
					padding: 15px;
					background: #f3e5f5;
					border-radius: 5px;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">
					<h1>🔒 Advanced Security Report</h1>
					<p><strong>Generated:</strong> ${report.metadata?.generatedAt || new Date().toISOString()}</p>
					<p><strong>Scanner Version:</strong> ${report.metadata?.scannerVersion || '1.8.0'}</p>
				</div>
				
				<div class="summary">
					<div class="summary-card critical">
						<h3>Critical</h3>
						<p>${report.summary?.critical || 0}</p>
					</div>
					<div class="summary-card high">
						<h3>High</h3>
						<p>${report.summary?.high || 0}</p>
					</div>
					<div class="summary-card medium">
						<h3>Medium</h3>
						<p>${report.summary?.medium || 0}</p>
					</div>
					<div class="summary-card low">
						<h3>Low</h3>
						<p>${report.summary?.low || 0}</p>
					</div>
				</div>
				
				${report.compliance ? `
				<div class="compliance">
					<h2>📋 Compliance Status</h2>
					${Object.entries(report.compliance).map(([standard, status]: [string, any]) => `
						<p><strong>${standard}:</strong> ${status.status === 'compliant' ? '✅ Compliant' : '⚠️ Non-compliant'}</p>
					`).join('')}
				</div>
				` : ''}
				
				${report.trends ? `
				<div class="trends">
					<h2>📈 Trend Analysis</h2>
					<p><strong>Change from last scan:</strong> ${report.trends.change || 'No data'}</p>
					<p><strong>Trend:</strong> ${report.trends.trend || 'Stable'}</p>
				</div>
				` : ''}
				
				<h2>Vulnerabilities (${report.vulnerabilities?.length || 0})</h2>
				${(report.vulnerabilities || []).map((vuln: any) => `
					<div class="vulnerability ${vuln.severity?.toLowerCase() || 'medium'}">
						<h3>${vuln.type} - ${vuln.severity}</h3>
						<p><strong>File:</strong> ${vuln.file}</p>
						<p><strong>Line:</strong> ${vuln.line}</p>
						<p><strong>Description:</strong> ${vuln.description}</p>
						<p><strong>Recommendation:</strong> ${vuln.recommendation}</p>
						${vuln.confidence ? `<p><strong>Confidence:</strong> ${vuln.confidence}</p>` : ''}
					</div>
				`).join('')}
			</div>
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