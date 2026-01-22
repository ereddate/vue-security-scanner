const fs = require('fs');
const path = require('path');

/**
 * Utility function to read a file safely
 * @param {string} filePath - Path to the file
 * @returns {string|null} - File content or null if error
 */
function readFileSafely(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.warn(`Could not read file ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Utility function to check if a file exists
 * @param {string} filePath - Path to the file
 * @returns {boolean} - True if file exists
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Utility function to get file extension
 * @param {string} filePath - Path to the file
 * @returns {string} - File extension (without dot)
 */
function getFileExtension(filePath) {
  return path.extname(filePath).substring(1).toLowerCase();
}

/**
 * Utility function to normalize file path
 * @param {string} filePath - Path to the file
 * @returns {string} - Normalized path
 */
function normalizePath(filePath) {
  return path.normalize(filePath);
}

/**
 * Utility function to resolve relative path
 * @param {string} basePath - Base path
 * @param {string} relativePath - Relative path
 * @returns {string} - Resolved path
 */
function resolvePath(basePath, relativePath) {
  return path.resolve(basePath, relativePath);
}

module.exports = {
  readFileSafely,
  fileExists,
  getFileExtension,
  normalizePath,
  resolvePath
};