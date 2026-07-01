const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    label: { type: String, required: true, trim: true },
    color: { type: String, required: true, default: '#94A3B8' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
