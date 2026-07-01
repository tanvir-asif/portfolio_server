const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function getUsers(req, res) {
  const users = await User.find().select('-passwordHash').sort({ createdAt: 1 }).lean();
  res.json(users);
}

async function createUser(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }
  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists) return res.status(409).json({ error: 'A user with that email already exists.' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email: email.toLowerCase().trim(),
    passwordHash,
    role: role === 'admin' ? 'admin' : 'viewer',
  });
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
}

async function deleteUser(req, res) {
  const targetId = req.params.id;

  // A user cannot delete their own account
  if (targetId === String(req.user._id)) {
    return res.status(403).json({ error: 'You cannot delete your own account.' });
  }

  // At least one admin must remain
  const target = await User.findById(targetId);
  if (!target) return res.status(404).json({ error: 'User not found' });

  if (target.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) {
      return res.status(403).json({ error: 'At least one admin must remain.' });
    }
  }

  await target.deleteOne();
  res.json({ message: 'User removed' });
}

module.exports = { getUsers, createUser, deleteUser };
