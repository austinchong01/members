// ===== controllers/indexController.js =====
const renderHome = (req, res) => {
  res.render("index", { user: req.user, errors: [] });
};

module.exports = {
  renderHome
};