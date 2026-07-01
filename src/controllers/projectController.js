const Project = require('../models/Project');

async function getProjects(req, res) {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  // Public endpoint only shows published; authenticated admins see all
  if (!req.user) filter.status = 'published';
  const projects = await Project.find(filter).sort({ createdAt: -1 }).lean();
  res.json(projects);
}

async function createProject(req, res) {
  const project = await Project.create(req.body);
  res.status(201).json(project);
}

async function updateProject(req, res) {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
}

async function deleteProject(req, res) {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ message: 'Project deleted' });
}

module.exports = { getProjects, createProject, updateProject, deleteProject };
