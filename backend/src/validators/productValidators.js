const { body } = require('express-validator');

const productValidation = [
  body('productId')
    .trim()
    .notEmpty()
    .withMessage('Product ID is required')
    .matches(/^[A-Za-z0-9-]+$/)
    .withMessage('Product ID must contain only letters, numbers, and hyphens'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  body('createdAt')
    .optional()
    .isISO8601()
    .withMessage('Created date must be a valid date'),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company is required')
    .isLength({ min: 2 })
    .withMessage('Company name must be at least 2 characters'),
];

const updateProductValidation = [
  body('productId')
    .optional()
    .trim()
    .matches(/^[A-Za-z0-9-]+$/)
    .withMessage('Product ID must contain only letters, numbers, and hyphens'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  body('createdAt')
    .optional()
    .isISO8601()
    .withMessage('Created date must be a valid date'),
  body('company')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Company name must be at least 2 characters'),
];

module.exports = { productValidation, updateProductValidation };
