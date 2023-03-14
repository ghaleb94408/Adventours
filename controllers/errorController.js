const env = require('dotenv');
const AppError = require('../utility/appError');

env.config({ path: '../config.env' });
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateKeyDB = (err) => {
  const [[key, value]] = Object.entries(err.keyValue);
  const message = `Duplicate field. ${key}: ${value}. please use another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Error that are not operational. EX: 3rd party libraries, programming errors
    // Log the error
    console.error(err);
    // Send a generic message
    res.status(500).json({
      status: 'Error',
      message: 'Something went wrong...',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let modError = err;
    if (modError.name === 'CastError') modError = handleCastErrorDB(modError);
    if (modError.code === 11000) modError = handleDuplicateKeyDB(modError);
    if (modError.name === 'ValidationError')
      modError = handleValidationErrorDB(modError);
    sendErrorProd(modError, res);
  }
};
