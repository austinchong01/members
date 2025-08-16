// ===== utils/sanitization.js =====
const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";
  return input.trim().replace(/[<>]/g, "").substring(0, 255);
};

const sanitizeName = (name) => {
  if (typeof name !== "string") return "";
  return name
    .trim()
    .replace(/[^a-zA-Z\s'-]/g, "")
    .substring(0, 100);
};

const sanitizeEmail = (email) => {
  if (typeof email !== "string") return "";
  return email.trim().toLowerCase().substring(0, 255);
};

module.exports = {
  sanitizeInput,
  sanitizeName,
  sanitizeEmail,
};
