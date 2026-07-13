const router = require('express').Router();
const { getPosts, getPostBySlug, getPostById, createPost, updatePost, deletePost } = require('../controllers/postController');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/', (req, res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return requireAuth(req, res, () => next());
  }
  next();
}, getPosts);

router.get('/:slug', (req, res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return requireAuth(req, res, () => next());
  next();
}, getPostBySlug);

router.get('/id/:id', requireAuth, getPostById);
router.post('/', requireAuth, requireAdmin, createPost);
router.put('/:id', requireAuth, requireAdmin, updatePost);
router.delete('/:id', requireAuth, requireAdmin, deletePost);

module.exports = router;
