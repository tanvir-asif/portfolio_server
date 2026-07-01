const Message = require('../models/Message');

// Public — contact form submission
async function createMessage(req, res) {
  const { name, email, subject, body } = req.body;
  if (!name || !email || !subject || !body) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const message = await Message.create({ name, email, subject, body });
  res.status(201).json(message);
}

// Admin — list messages
async function getMessages(req, res) {
  const filter = {};
  if (req.query.filter === 'unread') filter.read = false;
  const messages = await Message.find(filter).sort({ createdAt: -1 }).lean();
  res.json(messages);
}

// Admin — mark as read
async function markRead(req, res) {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  if (!message) return res.status(404).json({ error: 'Message not found' });
  res.json(message);
}

// Admin — delete
async function deleteMessage(req, res) {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) return res.status(404).json({ error: 'Message not found' });
  res.json({ message: 'Message deleted' });
}

module.exports = { createMessage, getMessages, markRead, deleteMessage };
