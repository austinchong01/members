// ===== routes/authRouter.js =====
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { signUpValidation, loginValidation, membershipRequestValidation } = require('../validators/authValidators');
const { loginLimiter, signUpLimiter } = require('../config/security');

// Sign up routes
router.get('/sign-up', authController.renderSignUp);
router.post('/sign-up', signUpLimiter, signUpValidation, authController.handleSignUp);

// Login routes - apply rate limiting only to login POST
router.post('/login', loginLimiter, loginValidation, authController.handleLogin);

// Logout route - no rate limiting needed
router.get('/logout', authController.handleLogout);

// Membership request routes
router.get('/membership-request', authController.renderMembershipRequest);
router.post('/membership-request', membershipRequestValidation, authController.handleMembershipRequest);

module.exports = router;