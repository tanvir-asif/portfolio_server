const router = require('express').Router();
const { getContent, updateContent } = require('../controllers/contentController');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/', getContent);
router.put('/', requireAuth, requireAdmin, updateContent);

module.exports = router;
