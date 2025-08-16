// ===== config/security.js =====
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const signUpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: "Too many sign-up attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const configureSecurity = (app) => {
  app.use(helmet());
};

module.exports = { configureSecurity, loginLimiter, signUpLimiter };