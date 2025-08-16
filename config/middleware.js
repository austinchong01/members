// ===== config/middleware.js =====
const express = require("express");
const session = require("express-session");
const passport = require("passport");

const configureMiddleware = (app) => {
  // Session configuration
  app.use(session({ 
    secret: process.env.SESSION_SECRET || "cats",
    resave: false, 
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use(express.urlencoded({ extended: false, limit: '10kb' }));
  
  app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });
};

module.exports = { configureMiddleware };