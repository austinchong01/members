// ===== controllers/messageController.js =====
const { validationResult } = require("express-validator");
const pool = require("../db/pool");
const { sanitizeInput } = require("../utils/sanitization");

const renderNewMessage = (req, res) => {
  // Only allow logged-in users
  if (!req.user) {
    return res.redirect('/auth/login');
  }
  
  res.render("new-message", { 
    user: req.user,
    errors: [],
    formData: {}
  });
};

const handleNewMessage = async (req, res, next) => {
  try {
    // Check if user is logged in
    if (!req.user) {
      return res.redirect('/auth/login');
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("new-message", { 
        user: req.user,
        errors: errors.array(),
        formData: req.body
      });
    }

    // Sanitize input after validation passes
    const title = sanitizeInput(req.body.title);
    const content = sanitizeInput(req.body.content);
    
    // Insert message into database
    await pool.query(
      "INSERT INTO messages (title, content, author_id, created_at) VALUES ($1, $2, $3, NOW())", 
      [title, content, req.user.id]
    );
    
    res.redirect("/?message=created");
  } catch (error) {
    console.error('Message creation error:', error);
    res.status(500).render("new-message", {
      user: req.user,
      errors: [{ msg: "An error occurred while creating your message. Please try again." }],
      formData: req.body
    });
  }
};

const handleDeleteMessage = async (req, res, next) => {
  try {
    // Check if user is logged in and is an admin
    if (!req.user) {
      console.log('No user logged in');
      return res.redirect('/');
    }

    if (!req.user.is_admin) {
      console.log('User is not admin:', req.user);
      return res.redirect('/?error=not_admin');
    }

    const messageId = parseInt(req.params.id);
    
    if (!messageId || isNaN(messageId)) {
      return res.redirect('/?error=invalid_id');
    }

    // Check if message exists
    const messageCheck = await pool.query("SELECT id FROM messages WHERE id = $1", [messageId]);
    if (messageCheck.rows.length === 0) {
      return res.redirect('/?error=message_not_found');
    }

    // Delete the message
    await pool.query("DELETE FROM messages WHERE id = $1", [messageId]);
    
    console.log(`Message ${messageId} deleted by admin ${req.user.email}`);
    res.redirect("/?message=deleted");
    
  } catch (error) {
    console.error('Message deletion error:', error);
    res.redirect("/?error=delete_failed");
  }
};

module.exports = {
  renderNewMessage,
  handleNewMessage,
  handleDeleteMessage
};