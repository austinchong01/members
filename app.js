// app.js
require("dotenv").config();
const express = require("express");
const path = require("node:path");

// Import configuration and middleware
const { configureMiddleware } = require('./config/middleware');
const { configureSecurity } = require('./config/security');
require('./config/passport'); // Initialize passport configuration

// Import routes
const authRoutes = require('./routes/authRouter');
const indexRoutes = require('./routes/indexRouter');
const messageRoutes = require('./routes/messageRouter');

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Configure security and middleware
configureSecurity(app);
configureMiddleware(app);

// Add this line after configuring middleware
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/messages', messageRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    message: "Something went wrong. Please try again.",
    user: req.user || null
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("error", {
    message: "Page not found",
    user: req.user || null
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`App listening on port ${PORT}!`);
});