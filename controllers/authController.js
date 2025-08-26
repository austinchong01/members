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
        formData: req.body // Keep original unsanitized data for form re-population
      });
    }

    // Only sanitize AFTER validation passes
    const firstName = sanitizeName(req.body.first_name);
    const lastName = sanitizeName(req.body.last_name);
    const email = sanitizeEmail(req.body.email);
    const isAdmin = req.body.is_admin === 'true'; // Convert to boolean
    
    // If user is admin, automatically grant membership status
    const isMember = isAdmin ? true : false;

    // Check if user already exists (using sanitized email)
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).render("sign-up-form", {
        errors: [{ msg: "An account with this email already exists" }],
        formData: req.body // Keep original data for form re-population
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    
    await pool.query(
      "INSERT INTO users (first_name, last_name, email, password, is_member, is_admin) VALUES ($1, $2, $3, $4, $5, $6)", 
      [firstName, lastName, email, hashedPassword, isMember, isAdmin]
    );
    
    res.redirect("/");
  } catch (error) {
    console.error('Sign-up error:', error);
    res.status(500).render("sign-up-form", {
      errors: [{ msg: "An error occurred during registration. Please try again." }],
      formData: req.body // Keep original data even on server errors
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

  // Sanitize email only after validation passes
  const sanitizedEmail = sanitizeEmail(req.body.email);

  // Create a new request object with sanitized email for passport
  const sanitizedReq = {
    ...req,
    body: {
      ...req.body,
      email: sanitizedEmail
    }
  };

  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).render("index", {
        user: null,
        errors: [{ msg: info.message || "Invalid credentials" }]
      });
    }
    
    // Check if user is admin but not a member, and update if necessary
    if (user.is_admin && !user.is_member) {
      try {
        await pool.query(
          "UPDATE users SET is_member = true WHERE id = $1", 
          [user.id]
        );
        user.is_member = true; // Update the user object
        console.log(`Auto-granted membership to admin user: ${user.email}`);
      } catch (error) {
        console.error('Error auto-granting membership to admin:', error);
      }
    }
    
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(sanitizedReq, res, next); // Use sanitized request for passport
};

const handleLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

// New membership functions
const renderMembershipRequest = (req, res) => {
  // Only allow logged-in users who are not already members
  if (!req.user) {
    return res.redirect('/');
  }
  
  // If user is admin, they should already be a member, redirect to home
  if (req.user.is_admin) {
    return res.redirect('/');
  }
  
  if (req.user.is_member) {
    return res.redirect('/');
  }

  res.render("membership-request", { 
    user: req.user,
    errors: [] 
  });
};

const handleMembershipRequest = async (req, res, next) => {
  try {
    // Check if user is logged in and not already a member
    if (!req.user) {
      return res.redirect('/');
    }
    
    // If user is admin, they should already be a member
    if (req.user.is_admin) {
      return res.redirect('/');
    }
    
    if (req.user.is_member) {
      return res.redirect('/');
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("membership-request", { 
        user: req.user,
        errors: errors.array()
      });
    }

    const { membership_password } = req.body;
    
    // Check if the password is correct
    if (membership_password !== "membersonly") {
      return res.status(400).render("membership-request", {
        user: req.user,
        errors: [{ msg: "Incorrect membership password. Please try again." }]
      });
    }

    // Update user to member status
    await pool.query(
      "UPDATE users SET is_member = true WHERE id = $1", 
      [req.user.id]
    );
    
    // Update the session user object
    req.user.is_member = true;
    
    res.redirect("/?membership=success");
  } catch (error) {
    console.error('Membership request error:', error);
    res.status(500).render("membership-request", {
      user: req.user,
      errors: [{ msg: "An error occurred while processing your request. Please try again." }]
    });
  }
};

module.exports = {
  renderSignUp,
  handleSignUp,
  handleLogin,
  handleLogout,
  renderMembershipRequest,
  handleMembershipRequest
};