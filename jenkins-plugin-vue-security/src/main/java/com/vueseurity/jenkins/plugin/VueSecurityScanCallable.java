package com.vueseurity.jenkins.plugin;

import hudson.FilePath;
import hudson.Launcher;
import hudson.model.TaskListener;
import hudson.remoting.VirtualChannel;

import java.io.IOException;
import java.io.Serializable;

import org.jenkinsci.remoting.RoleChecker;

import hudson.slaves.SlaveComputer;

/**
 * Callable class for executing Vue Security Scanner command on the build agent
 */
public class VueSecurityScanCallable implements hudson.remoting.Callable<Integer, IOException>, Serializable {
    private static final long serialVersionUID = 1L;
    
    private final String command;
    private final FilePath workspace;
    private final TaskListener listener;

    public VueSecurityScanCallable(String command, FilePath workspace, TaskListener listener) {
        this.command = command;
        this.workspace = workspace;
        this.listener = listener;
    }

    @Override
    public Integer call() throws IOException {
        try {
            // Execute the command on the build agent
            ProcessBuilder pb = new ProcessBuilder("bash", "-c", command);
            pb.directory(new java.io.File(workspace.getRemote()));
            
            Process process = pb.start();
            
            // Redirect output to the build log
            Thread stdoutThread = new Thread(() -> {
                try (java.io.BufferedReader reader = new java.io.BufferedReader(
                        new java.io.InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        listener.getLogger().println(line);
                    }
                } catch (IOException e) {
                    listener.error("Error reading stdout: " + e.getMessage());
                }
            });
            
            Thread stderrThread = new Thread(() -> {
                try (java.io.BufferedReader reader = new java.io.BufferedReader(
                        new java.io.InputStreamReader(process.getErrorStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        listener.error(line);
                    }
                } catch (IOException e) {
                    listener.error("Error reading stderr: " + e.getMessage());
                }
            });
            
            stdoutThread.start();
            stderrThread.start();
            
            int exitCode = process.waitFor();
            
            stdoutThread.join();
            stderrThread.join();
            
            return exitCode;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Vue Security Scanner execution was interrupted", e);
        }
    }

    @Override
    public void checkRoles(RoleChecker checker) throws SecurityException {
        // Allow execution on build agents
    }
}