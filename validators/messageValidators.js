// ===== validators/messageValidators.js =====
const { body } = require("express-validator");

const messageValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1-100 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,!?'"()]+$/)
    .withMessage('Title can only contain letters, numbers, spaces, and common punctuation'),
  
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1-1000 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,!?'"()\n\r]+$/)
    .withMessage('Content can only contain letters, numbers, spaces, line breaks, and common punctuation')
];

module.exports = {
  messageValidation
};