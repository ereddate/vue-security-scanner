package com.vueseurity.jenkins.plugin;

import hudson.Launcher;
import hudson.Extension;
import hudson.FilePath;
import hudson.util.FormValidation;
import hudson.model.AbstractProject;
import hudson.model.Run;
import hudson.model.TaskListener;
import hudson.tasks.Builder;
import hudson.tasks.BuildStepDescriptor;
import jenkins.tasks.SimpleBuildStep;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.QueryParameter;
import org.kohsuke.stapler.StaplerRequest;
import net.sf.json.JSONObject;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.regex.Pattern;

/**
 * Vue Security Scanner Build Step
 * A Jenkins build step that performs security scanning on Vue.js projects
 */
public class VueSecurityScannerBuilder extends Builder implements SimpleBuildStep {

    private final String projectPath;
    private final String scanLevel;
    private final boolean failBuildOnVulnerabilities;
    private final String reportOutputPath;
    private final boolean enablePlugins;
    private final String customPluginPath;

    @DataBoundConstructor
    public VueSecurityScannerBuilder(String projectPath, String scanLevel, 
                                   boolean failBuildOnVulnerabilities, String reportOutputPath,
                                   boolean enablePlugins, String customPluginPath) {
        this.projectPath = projectPath;
        this.scanLevel = scanLevel != null ? scanLevel : "standard";
        this.failBuildOnVulnerabilities = failBuildOnVulnerabilities;
        this.reportOutputPath = reportOutputPath;
        this.enablePlugins = enablePlugins;
        this.customPluginPath = customPluginPath;
    }

    @Override
    public void perform(Run<?, ?> build, FilePath workspace, Launcher launcher, TaskListener listener) 
            throws InterruptedException, IOException {
        
        listener.getLogger().println("Starting Vue Security Scan...");
        listener.getLogger().println("Project Path: " + projectPath);
        listener.getLogger().println("Scan Level: " + scanLevel);
        listener.getLogger().println("Fail Build on Vulnerabilities: " + failBuildOnVulnerabilities);

        // Expand environment variables in paths
        String expandedProjectPath = projectPath;
        if (build.getEnvironment(listener) != null) {
            expandedProjectPath = build.getEnvironment(listener).expand(projectPath);
        }

        // Construct the command to run the Vue Security Scanner
        String command = constructCommand(expandedProjectPath, workspace, listener);
        
        // Execute the security scan
        int exitCode = executeCommand(launcher, workspace, listener, command);
        
        if (exitCode != 0 && failBuildOnVulnerabilities) {
            listener.error("Vue Security Scanner found vulnerabilities. Build failed.");
            throw new IOException("Vue Security Scanner failed with exit code: " + exitCode);
        } else if (exitCode == 0) {
            listener.getLogger().println("Vue Security Scan completed successfully.");
        } else {
            listener.getLogger().println("Vue Security Scan completed with vulnerabilities found.");
        }
    }

    private String constructCommand(String projectPath, FilePath workspace, TaskListener listener) {
        StringBuilder cmd = new StringBuilder();
        
        // Check if Node.js and npm are available
        cmd.append("if command -v vue-security-scanner >/dev/null 2>&1; then ");
        cmd.append("vue-security-scanner ");
        cmd.append(projectPath).append(" ");
        cmd.append("--level ").append(scanLevel).append(" ");
        
        if (reportOutputPath != null && !reportOutputPath.trim().isEmpty()) {
            cmd.append("--report ").append(reportOutputPath).append(" ");
        }
        
        if (enablePlugins) {
            cmd.append("--plugins-enabled ");
            if (customPluginPath != null && !customPluginPath.trim().isEmpty()) {
                cmd.append("--plugins-dir ").append(customPluginPath).append(" ");
            }
        }
        
        cmd.append("; else ");
        cmd.append("echo 'Vue Security Scanner is not installed.'; ");
        cmd.append("echo 'Please install it globally: npm install -g vue-security-scanner'; ");
        cmd.append("exit 1; ");
        cmd.append("fi");
        
        return cmd.toString();
    }

    private int executeCommand(Launcher launcher, FilePath workspace, TaskListener listener, String command) 
            throws IOException, InterruptedException {
        
        return launcher.getChannel().call(new VueSecurityScanCallable(command, workspace, listener));
    }

    public String getProjectPath() {
        return projectPath;
    }

    public String getScanLevel() {
        return scanLevel;
    }

    public boolean isFailBuildOnVulnerabilities() {
        return failBuildOnVulnerabilities;
    }

    public String getReportOutputPath() {
        return reportOutputPath;
    }

    public boolean isEnablePlugins() {
        return enablePlugins;
    }

    public String getCustomPluginPath() {
        return customPluginPath;
    }

    @Extension
    public static final class DescriptorImpl extends BuildStepDescriptor<Builder> {

        public DescriptorImpl() {
            load();
        }

        @Override
        public boolean isApplicable(Class<? extends AbstractProject> jobType) {
            return true;
        }

        @Override
        public String getDisplayName() {
            return "Vue Security Scanner";
        }

        public FormValidation doCheckProjectPath(@QueryParameter String projectPath) throws ServletException {
            if (projectPath.length() == 0) {
                return FormValidation.error("Please specify the project path");
            }
            return FormValidation.ok();
        }

        public FormValidation doTestInstallation(@QueryParameter String projectPath) throws IOException, ServletException {
            // Test if the Vue Security Scanner is properly installed
            return FormValidation.ok("Installation check would happen here in a real implementation");
        }

        public FormValidation doCheckScanLevel(@QueryParameter String scanLevel) throws ServletException {
            if (scanLevel == null || scanLevel.isEmpty()) {
                return FormValidation.ok("Using default scan level: standard");
            }
            
            if (!isValidScanLevel(scanLevel)) {
                return FormValidation.error("Invalid scan level. Use: basic, standard, or detailed");
            }
            
            return FormValidation.ok();
        }

        private boolean isValidScanLevel(String level) {
            return level.equals("basic") || level.equals("standard") || level.equals("detailed");
        }
    }
}