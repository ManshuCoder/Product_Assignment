const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    const error = new AppError('Validation failed', 400);
    error.errors = formatted;
    throw error;
  }

  next();
};

module.exports = validate;
