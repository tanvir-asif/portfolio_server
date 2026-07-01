const Post = require('../models/Post');

async function getPosts(req, res) {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (!req.user) filter.status = 'published';
  const posts = await Post.find(filter).sort({ createdAt: -1 }).lean();
  res.json(posts);
}

async function createPost(req, res) {
  const post = await Post.create(req.body);
  res.status(201).json(post);
}

async function updatePost(req, res) {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
}

async function deletePost(req, res) {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json({ message: 'Post deleted' });
}

async function getPostBySlug(req, res) {
  const filter = { slug: req.params.slug };
  if (!req.user) filter.status = 'published';
  const post = await Post.findOne(filter).lean();
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
}

module.exports = { getPosts, getPostBySlug, createPost, updatePost, deletePost };
