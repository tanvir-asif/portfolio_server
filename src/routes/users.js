const router = require('express').Router();
const { getUsers, createUser, deleteUser } = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/', requireAuth, requireAdmin, getUsers);
router.post('/', requireAuth, requireAdmin, createUser);
router.delete('/:id', requireAuth, requireAdmin, deleteUser);

module.exports = router;
