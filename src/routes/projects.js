const router = require('express').Router();
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

// Public GET — optionally attach user if token present (to expose drafts to admins)
router.get('/', (req, res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return requireAuth(req, res, () => next());
  }
  next();
}, getProjects);

router.post('/', requireAuth, requireAdmin, createProject);
router.put('/:id', requireAuth, requireAdmin, updateProject);
router.delete('/:id', requireAuth, requireAdmin, deleteProject);

module.exports = router;
