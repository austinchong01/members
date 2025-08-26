// ===== controllers/indexController.js =====
const pool = require("../db/pool");

const renderHome = async (req, res) => {
  try {
    // Fetch all messages with author information, ordered by newest first
    const { rows: messages } = await pool.query(`
      SELECT 
        m.id,
        m.title,
        m.content,
        m.created_at,
        u.first_name,
        u.last_name,
        u.is_member as author_is_member,
        u.is_admin as author_is_admin
      FROM messages m
      JOIN users u ON m.author_id = u.id
      ORDER BY m.created_at DESC
    `);

    res.render("index", { 
      user: req.user, 
      errors: [],
      query: req.query,
      messages: messages || []
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.render("index", { 
      user: req.user, 
      errors: [{ msg: "Error loading messages. Please try again." }],
      query: req.query,
      messages: []
    });
  }
};

module.exports = {
  renderHome
};