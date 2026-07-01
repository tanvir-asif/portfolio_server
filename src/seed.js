require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const seedData = require('../../seed.json');

const User = require('./models/User');
const Category = require('./models/Category');
const SkillGroup = require('./models/SkillGroup');
const SiteContent = require('./models/SiteContent');
const Project = require('./models/Project');
const Post = require('./models/Post');
const Message = require('./models/Message');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB:', process.env.MONGODB_URI);

  // ── Users ─────────────────────────────────────────────────
  for (const u of seedData.users) {
    const passwordHash = await bcrypt.hash(u.password, 12);
    await User.findOneAndUpdate(
      { email: u.email.toLowerCase() },
      { name: u.name, email: u.email.toLowerCase(), passwordHash, role: u.role },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  const userCount = await User.countDocuments();
  console.log(`Users:       ${userCount}`);

  // ── Categories ────────────────────────────────────────────
  for (const c of seedData.categories) {
    await Category.findOneAndUpdate(
      { slug: c.slug },
      { slug: c.slug, label: c.label, color: c.color },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  const catCount = await Category.countDocuments();
  console.log(`Categories:  ${catCount}`);

  // ── Skill Groups ──────────────────────────────────────────
  await SkillGroup.deleteMany({});
  await SkillGroup.insertMany(
    seedData.skillGroups.map((g) => ({ title: g.title, items: g.items, order: g.order }))
  );
  const skillCount = await SkillGroup.countDocuments();
  console.log(`SkillGroups: ${skillCount}`);

  // ── Site Content (singleton) ──────────────────────────────
  await SiteContent.findOneAndUpdate(
    { key: 'main' },
    { key: 'main', hero: seedData.siteContent.hero, aboutBio: seedData.siteContent.aboutBio },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`SiteContent: 1`);

  // ── Projects ──────────────────────────────────────────────
  for (const p of seedData.projects) {
    await Project.findOneAndUpdate(
      { slug: p.slug },
      {
        slug: p.slug,
        name: p.name,
        category: p.category,
        year: p.year,
        imgLabel: p.imgLabel,
        short: p.short,
        tagline: p.tagline,
        overview: p.overview,
        whatIDid: p.whatIDid,
        tech: p.tech,
        stats: p.stats,
        achievements: p.achievements,
        impact: p.impact,
        liveUrl: p.liveUrl,
        githubUrl: p.githubUrl,
        status: p.status,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  const projectCount = await Project.countDocuments();
  console.log(`Projects:    ${projectCount}`);

  // ── Blog Posts ────────────────────────────────────────────
  for (const post of seedData.posts) {
    await Post.findOneAndUpdate(
      { slug: post.slug },
      {
        slug: post.slug,
        title: post.title,
        category: post.category,
        date: post.date,
        readTime: post.readTime,
        excerpt: post.excerpt,
        body: post.body,
        status: post.status,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  const postCount = await Post.countDocuments();
  console.log(`Posts:       ${postCount}`);

  // ── Messages ──────────────────────────────────────────────
  const existingCount = await Message.countDocuments();
  if (existingCount === 0) {
    await Message.insertMany(
      seedData.messages.map((m) => ({
        name: m.name,
        email: m.email,
        subject: m.subject,
        body: m.body,
        read: m.read,
      }))
    );
  }
  const msgCount = await Message.countDocuments();
  console.log(`Messages:    ${msgCount}`);

  console.log('\nSeed complete.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
