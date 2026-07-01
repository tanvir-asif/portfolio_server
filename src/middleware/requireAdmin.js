// Must be used after requireAuth.
// Blocks viewer-role users from write endpoints with 403.
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Read-only mode — switch to an admin account to make changes.',
    });
  }
  next();
}

module.exports = requireAdmin;
