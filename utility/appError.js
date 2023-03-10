// Error Handeling Class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';
    // This is to flag the error as operational.
    this.isOperational = true;
    // capture the stacktrace which will help us locate the error in development
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
