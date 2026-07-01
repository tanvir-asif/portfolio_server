const SiteContent = require('../models/SiteContent');

async function getContent(req, res) {
  const doc = await SiteContent.findOne({ key: 'main' }).lean();
  res.json(doc || {});
}

async function updateContent(req, res) {
  const { hero, aboutBio } = req.body;
  const doc = await SiteContent.findOneAndUpdate(
    { key: 'main' },
    { ...(hero && { hero }), ...(aboutBio !== undefined && { aboutBio }) },
    { new: true, upsert: true, runValidators: true }
  );
  res.json(doc);
}

module.exports = { getContent, updateContent };
