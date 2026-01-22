// utils/error-handler.js
// 错误处理工具

class SecurityScannerError extends Error {
  constructor(message, code, originalError = null) {
    super(message);
    this.name = 'SecurityScannerError';
    this.code = code;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

class ErrorHandler {
  static handleError(error, context = '') {
    if (error instanceof SecurityScannerError) {
      // 已经是包装过的错误
      console.error(`[SECURITY SCANNER ERROR] ${context ? context + ': ' : ''}${error.message}`);
      if (error.originalError) {
        console.error('Original error:', error.originalError);
      }
      return error;
    } else {
      // 包装原始错误
      const wrappedError = new SecurityScannerError(
        error.message,
        'UNKNOWN_ERROR',
        error
      );
      console.error(`[UNHANDLED ERROR] ${context ? context + ': ' : ''}${error.message}`);
      console.error('Stack trace:', error.stack);
      return wrappedError;
    }
  }

  static handleFileError(filePath, error) {
    return this.handleError(error, `Processing file: ${filePath}`);
  }

  static handleValidationError(validationError) {
    return this.handleError(validationError, 'Validation error');
  }

  static handleParseError(parseError, filePath) {
    return this.handleError(parseError, `Parsing file: ${filePath}`);
  }

  static formatError(error) {
    return {
      type: error.name,
      message: error.message,
      code: error.code,
      timestamp: error.timestamp,
      stack: error.originalError ? error.originalError.stack : error.stack
    };
  }
}

module.exports = {
  SecurityScannerError,
  ErrorHandler
};