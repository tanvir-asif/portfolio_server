const mongoose = require('mongoose');

const statSchema = new mongoose.Schema(
  { value: String, label: String },
  { _id: false }
);

const heroSchema = new mongoose.Schema(
  {
    badge: String,
    headline: String,
    headlineAccent: String,
    intro: String,
    stats: [statSchema],
  },
  { _id: false }
);

// Singleton — only ever one document, identified by key: 'main'
const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    hero: heroSchema,
    aboutBio: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteContent', siteContentSchema);
