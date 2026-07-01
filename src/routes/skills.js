const router = require('express').Router();
const { getSkills, updateSkills } = require('../controllers/skillController');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/', getSkills);
router.put('/', requireAuth, requireAdmin, updateSkills);

module.exports = router;
