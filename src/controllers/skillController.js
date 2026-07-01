const SkillGroup = require('../models/SkillGroup');

async function getSkills(req, res) {
  const groups = await SkillGroup.find().sort({ order: 1 }).lean();
  res.json(groups);
}

// Full replace — client sends the complete updated array of groups
async function updateSkills(req, res) {
  const groups = req.body; // array of { title, items, order }
  if (!Array.isArray(groups)) {
    return res.status(400).json({ error: 'Body must be an array of skill groups' });
  }
  await SkillGroup.deleteMany({});
  const created = await SkillGroup.insertMany(
    groups.map((g, i) => ({ title: g.title, items: g.items || [], order: g.order ?? i }))
  );
  res.json(created);
}

module.exports = { getSkills, updateSkills };
