const mongoose = require('mongoose');

const statSchema = new mongoose.Schema(
  { value: String, label: String },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true }, // category slug
    year: { type: String },
    imgLabel: { type: String, default: 'project mockup' },
    images: [{ type: String }],          // 1-2 ImgBB URLs
    short: { type: String },        // one-line card description
    tagline: { type: String },      // tooltip / modal subheading
    overview: { type: String },
    whatIDid: [{ type: String }],
    tech: [{ type: String }],
    stats: [statSchema],
    achievements: [{ type: String }],
    impact: { type: String },
    liveUrl: { type: String },
    githubUrl: { type: String },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
