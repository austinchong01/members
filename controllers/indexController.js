// ===== controllers/indexController.js =====
const renderHome = (req, res) => {
  res.render("index", { 
    user: req.user, 
    errors: [],
    query: req.query // Pass query parameters to the view for success messages
  });
};

module.exports = {
  renderHome
};