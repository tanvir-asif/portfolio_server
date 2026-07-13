const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    date: { type: String },         // display string e.g. "Jun 18, 2026"
    readTime: { type: String },     // e.g. "8 min read"
    excerpt: { type: String },
    body: [{ type: String }],       // array of paragraphs
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    seoKeyword: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
