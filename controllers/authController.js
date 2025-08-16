// ===== controllers/authController.js =====
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { validationResult } = require("express-validator");
const pool = require("../db/pool");
const { sanitizeName, sanitizeEmail } = require("../utils/sanitization");

const renderSignUp = (req, res) => {
  res.render("sign-up-form", { errors: [] });
};

const handleSignUp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", { 
        errors: errors.array(),
        formData: req.body
      });
    }

    const firstName = sanitizeName(req.body.first_name);
    const lastName = sanitizeName(req.body.last_name);
    const email = sanitizeEmail(req.body.email);

    // Check if user already exists
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).render("sign-up-form", {
        errors: [{ msg: "An account with this email already exists" }],
        formData: req.body
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    
    await pool.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)", 
      [firstName, lastName, email, hashedPassword]
    );
    
    res.redirect("/");
  } catch (error) {
    console.error('Sign-up error:', error);
    res.status(500).render("sign-up-form", {
      errors: [{ msg: "An error occurred during registration. Please try again." }],
      formData: req.body
    });
  }
};

const handleLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("index", { 
      user: null,
      errors: errors.array()
    });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).render("index", {
        user: null,
        errors: [{ msg: info.message || "Invalid credentials" }]
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
};

const handleLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

module.exports = {
  renderSignUp,
  handleSignUp,
  handleLogin,
  handleLogout
};
