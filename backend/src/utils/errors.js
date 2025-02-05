// Custom error class
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Create custom error function
const createCustomError = (message, statusCode) => {
  return new CustomError(message, statusCode);
};

module.exports = {
  CustomError,
  createCustomError
}; 