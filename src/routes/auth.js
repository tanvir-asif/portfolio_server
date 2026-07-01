const router = require('express').Router();
const { login, logout } = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');

router.post('/login', login);
router.post('/logout', requireAuth, logout);

module.exports = router;
