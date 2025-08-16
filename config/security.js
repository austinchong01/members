// ===== config/security.js =====
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const configureSecurity = (app) => {
  app.use(helmet());
  
  // Apply rate limiting to auth routes
  app.use('/auth', authLimiter);
};

module.exports = { configureSecurity, authLimiter };