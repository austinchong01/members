// ===== routes/messageRouter.js =====
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { messageValidation } = require('../validators/messageValidators');

// Message creation routes
router.get('/new', messageController.renderNewMessage);
router.post('/new', messageValidation, messageController.handleNewMessage);

module.exports = router;