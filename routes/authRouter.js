// ===== routes/authRoutes.js =====
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { signUpValidation, loginValidation } = require('../validators/authValidators');

// Sign up routes
router.get('/sign-up', authController.renderSignUp);
router.post('/sign-up', signUpValidation, authController.handleSignUp);

// Login routes
router.post('/login', loginValidation, authController.handleLogin);

// Logout route
router.get('/logout', authController.handleLogout);

module.exports = router;