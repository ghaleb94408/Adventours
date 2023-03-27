const env = require('dotenv');
const AppError = require('../utility/appError');

env.config({ path: '../config.env' });
const sendErrorDev = (err, req, res) => {
  // if the error comes from an api request
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  // if the error comes from the frontend
  else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      errorMessage: err.message,
    });
  }
};
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateKeyDB = (err) => {
  const [[key, value]] = Object.entries(err.keyValue);
  const message = `Duplicate field: ${key}: ${value}. please use another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTInvalidError = () =>
  new AppError('Invalid token, please log in again', 401);
const handleJWTExpiredError = () =>
  new AppError('Token has expired, please log in again', 401);
const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Error that are not operational. EX: 3rd party libraries, programming errors
    // Log the error
    // eslint-disable-next-line no-console
    console.error(err);
    // Send a generic message
    return res.status(500).json({
      status: 'Error',
      message: 'Something went wrong...',
    });
  }
  // frontend error handling
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      errorMessage: err.message,
    });
  }
  // Error that are not operational. EX: 3rd party libraries, programming errors
  // Log the error
  // eslint-disable-next-line no-console
  console.error(err);
  // Send a generic message
  return res.status(500).render('error', {
    title: 'Something went wrong!',
    errorMessage: 'something went wrong! sorry for the inconvenience.',
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let modError = err;
    modError.message = err.message;
    if (modError.name === 'CastError') modError = handleCastErrorDB(modError);
    if (modError.code === 11000) modError = handleDuplicateKeyDB(modError);
    if (modError.name === 'ValidationError')
      modError = handleValidationErrorDB(modError);
    if (modError.name === 'JsonWebTokenError')
      modError = handleJWTInvalidError();
    if (modError.name === 'TokenExpiredError')
      modError = handleJWTExpiredError();
    sendErrorProd(modError, req, res);
  }
};
