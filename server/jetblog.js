import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || process.env.JETBLOG_PORT || 3001;

app.use(cors({ origin: '*' }));

// Raw body capture for HMAC verification — MUST be before express.json()
app.use((req, _res, next) => {
  if (req.method === 'POST' && (req.path === '/' || req.path === '/api/jetblog')) {
    let data = '';
    req.on('data', chunk => { data += chunk.toString(); });
    req.on('end', () => { req.rawBody = data; next(); });
  } else {
    next();
  }
});

app.use(express.json());

// ── Serve built frontend (dist/) ──────────────────────────────────────────────
const DIST_DIR = path.resolve(__dirname, '../dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  console.log('📁 Serving frontend from dist/');
}

// ── Storage helpers ───────────────────────────────────────────────────────────
// On Render, use /tmp for writable storage (filesystem is ephemeral anyway)
// Posts are served via /api/posts/* so frontend can reach them
const POSTS_DIR = path.resolve(__dirname, '../public/posts');

function ensureDir() {
  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
}

function readIndex() {
  const f = path.join(POSTS_DIR, 'index.json');
  try { return JSON.parse(fs.readFileSync(f, 'utf-8')); } catch { return []; }
}

function savePost(post) {
  ensureDir();
  fs.writeFileSync(path.join(POSTS_DIR, `${post.slug}.json`), JSON.stringify(post, null, 2));
  const index = readIndex();
  const i = index.findIndex(p => p.slug === post.slug);
  const summary = {
    id: post.id, title: post.title, slug: post.slug,
    featuredImage: post.featuredImage, seoTitle: post.seoTitle,
    seoDescription: post.seoDescription, tags: post.tags,
    readTime: post.readTime, publishedAt: post.publishedAt, excerpt: post.excerpt
  };
  if (i >= 0) index[i] = summary; else index.unshift(summary);
  fs.writeFileSync(path.join(POSTS_DIR, 'index.json'), JSON.stringify(index, null, 2));
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 80) + '-' + Date.now();
}
function stripHtml(html) { return html.replace(/<[^>]*>/g, '').trim(); }
function calcReadTime(html) {
  return Math.max(1, Math.ceil(stripHtml(html).split(/\s+/).filter(Boolean).length / 200));
}
function verifySig(rawBody, header) {
  const secret = process.env.JETBLOG_SECRET || 'fe76b9e9490158711f3d83fa694366679522bac1048aaadb99cd36b485dfe240';
  const expected = crypto.createHmac('sha256', secret).update(rawBody, 'utf-8').digest('hex');
  try { return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(header, 'hex')); } catch { return false; }
}

// ── API: Posts (for frontend to fetch live posts) ─────────────────────────────
app.get('/api/posts', (_req, res) => {
  res.json(readIndex());
});

app.get('/api/posts/:slug', (req, res) => {
  const f = path.join(POSTS_DIR, `${req.params.slug}.json`);
  if (!fs.existsSync(f)) return res.status(404).json({ error: 'Not found' });
  res.json(JSON.parse(fs.readFileSync(f, 'utf-8')));
});

// ── Webhook ───────────────────────────────────────────────────────────────────
app.get('/api/jetblog', (_req, res) => res.json({ status: 'JetBlog webhook active' }));

app.post(['/', '/api/jetblog'], (req, res) => {
  const sig = req.headers['x-jetblog-signature'];
  const method = req.method;
  const path = req.path;

  console.log(`[Incoming POST] Method: ${method}, Path: ${path}`);

  if (!sig) {
    console.log(`[Incoming POST] Signature verification: FAILED (Missing signature header)`);
    return res.status(401).json({ error: 'Missing signature' });
  }

  const isVerified = verifySig(req.rawBody || '', sig);
  console.log(`[Incoming POST] Signature verification: ${isVerified ? 'SUCCESS' : 'FAILED'}`);

  if (!isVerified) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let payload;
  try {
    payload = JSON.parse(req.rawBody);
  } catch {
    console.log(`[Incoming POST] JSON parse: FAILED`);
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  if (payload.event === 'article.published' && payload.data) {
    const { title = 'Untitled', content = '', featuredImageUrl, seoTitle, seoDescription, tags } = payload.data;
    console.log(`[Incoming POST] Article title: "${title}"`);
    const slug = generateSlug(title);
    const plain = stripHtml(content);
    const post = {
      id: crypto.randomUUID(),
      title, slug, content,
      featuredImage: featuredImageUrl || null,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || plain.substring(0, 160),
      tags: Array.isArray(tags) ? tags : [],
      readTime: calcReadTime(content),
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      excerpt: plain.substring(0, 150) + (plain.length > 150 ? '...' : ''),
    };
    try {
      savePost(post);
      console.log(`✅ Published: "${title}" → /blog/${slug}`);
      return res.json({
        postId: post.id,
        url: `/blog/${slug}`
      });
    } catch (e) {
      console.error('❌ Save failed:', e);
      return res.status(500).json({ error: 'Save failed' });
    }
  }

  console.log(`[Incoming POST] Event type: "${payload.event}" (not article.published)`);
  return res.json({ received: true });
});

// ── SPA fallback: all other routes → index.html ───────────────────────────────
if (fs.existsSync(DIST_DIR)) {
  app.use((_req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, () => {
  ensureDir();
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`   Webhook: /api/jetblog`);
  console.log(`   Posts API: /api/posts`);
});
