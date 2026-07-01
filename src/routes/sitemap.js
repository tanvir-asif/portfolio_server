const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

const SITE = 'https://tanvirasif.dev';

function url(loc, priority, changefreq, lastmod) {
  return [
    '  <url>',
    `    <loc>${SITE}${loc}</loc>`,
    lastmod ? `    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>` : '',
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n');
}

router.get('/sitemap.xml', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' }).select('slug updatedAt').lean();

    const staticPages = [
      url('/',          '1.0', 'weekly',  null),
      url('/projects',  '0.9', 'weekly',  null),
      url('/blog',      '0.8', 'weekly',  null),
      url('/contact',   '0.7', 'monthly', null),
    ];

    const postPages = posts.map(p =>
      url(`/blog/${p.slug}`, '0.7', 'monthly', p.updatedAt)
    );

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...staticPages,
      ...postPages,
      '</urlset>',
    ].join('\n');

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Failed to generate sitemap');
  }
});

module.exports = router;
