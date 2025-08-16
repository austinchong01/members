// ===== validators/authValidators.js =====
const { body } = require("express-validator");

const signUpValidation = [
  body('first_name')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('First name must be between 1-20 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('last_name')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Last name must be between 1-20 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),
  
  body('password')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be between 8-20 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  
  body('confirm_password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

module.exports = {
  signUpValidation,
  loginValidation
};