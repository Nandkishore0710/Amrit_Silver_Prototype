import { body, validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

export const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and a number'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),
  validate
];

export const validateLogin = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

export const validateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required').isLength({ max: 100 }),
  body('description').notEmpty().withMessage('Description is required').isLength({ min: 20 }),
  body('category').notEmpty().withMessage('Category is required'),
  body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  validate
];

export const validateOrder = [
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('shippingAddress.street').notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode').matches(/^[0-9]{6}$/).withMessage('Pincode must be 6 digits'),
  body('paymentMethod').isIn(['stripe', 'cod', 'upi']).withMessage('Invalid payment method'),
  validate
];

export const validateReview = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters'),
  validate
];
