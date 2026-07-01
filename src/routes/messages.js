const router = require('express').Router();
const { createMessage, getMessages, markRead, deleteMessage } = require('../controllers/messageController');
const { sendContactNotification } = require('../lib/mailer');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

router.post('/', createMessage);                                    // public — contact form
router.get('/', requireAuth, getMessages);                          // viewer can read
router.patch('/:id/read', requireAuth, markRead);                   // viewer can mark read
router.delete('/:id', requireAuth, requireAdmin, deleteMessage);    // admin only

// Temporary — test email delivery, remove after confirming it works
router.post('/test-email', requireAuth, requireAdmin, async (req, res) => {
  try {
    await sendContactNotification({
      name: 'Test User',
      email: process.env.EMAIL_USER,
      subject: 'Test email from portfolio',
      body: 'This is a test notification to confirm email delivery is working.',
    });
    res.json({ ok: true, message: 'Email sent — check your inbox.' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
