require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const authRoutes    = require('./routes/auth');
const contentRoutes = require('./routes/content');
const projectRoutes = require('./routes/projects');
const postRoutes    = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const skillRoutes   = require('./routes/skills');
const messageRoutes = require('./routes/messages');
const userRoutes    = require('./routes/users');
const sitemapRoutes   = require('./routes/sitemap');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Trust Render's proxy so rate limiters see the real client IP, not the internal load balancer IP
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS — restricted to the configured client origin
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));

// Body parsing — 1 MB limit to prevent large-payload abuse
app.use(express.json({ limit: '1mb' }));

// Rate limiting: 10 attempts per 15 minutes on auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

// Rate limiting: 20 messages per hour on the contact form
const messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages sent. Please try again in an hour.' },
});

// Sitemap (no /api prefix — served at /api/sitemap.xml via this router)
app.use('/api', sitemapRoutes);

app.use('/api/auth',       authLimiter, authRoutes);
app.use('/api/content',    contentRoutes);
app.use('/api/projects',   projectRoutes);
app.use('/api/posts',      postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/skills',     skillRoutes);
app.use('/api/messages',   messageLimiter, messageRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/analytics',  analyticsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
