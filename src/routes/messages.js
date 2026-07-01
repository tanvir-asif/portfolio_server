const router = require('express').Router();
const { createMessage, getMessages, markRead, deleteMessage } = require('../controllers/messageController');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

router.post('/', createMessage);                                    // public — contact form
router.get('/', requireAuth, getMessages);                          // viewer can read
router.patch('/:id/read', requireAuth, markRead);                   // viewer can mark read
router.delete('/:id', requireAuth, requireAdmin, deleteMessage);    // admin only

module.exports = router;
