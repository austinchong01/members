// ===== config/security.js =====
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const signUpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Allow 3 sign-up attempts per hour per IP
  message: "Too many sign-up attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const configureSecurity = (app) => {
  app.use(helmet());
};

module.exports = { configureSecurity, loginLimiter, signUpLimiter };