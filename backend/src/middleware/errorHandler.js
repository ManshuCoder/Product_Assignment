const AppError = require('../utils/AppError');

const handleCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateKey = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(`${field} "${value}" already exists`, 409);
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(messages.join('. '), 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpired = () =>
  new AppError('Your session has expired. Please log in again.', 401);

const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKey(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpired();

  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR:', err);
  }

  const response = {
    success: false,
    message: error.message || 'Internal server error',
  };

  if (err.errors) response.errors = err.errors;
  if (process.env.NODE_ENV === 'development') response.stack = err.stack;

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
