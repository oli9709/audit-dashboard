import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.JETBLOG_PORT || 3001;

app.use(cors({ origin: '*' }));

// Raw body capture for HMAC verification
app.use('/api/jetblog', (req, _res, next) => {
  let data = '';
  req.on('data', chunk => { data += chunk.toString(); });
  req.on('end', () => { (req as any).rawBody = data; next(); });
});

app.use(express.json());

// ── Storage helpers ──────────────────────────────────────────────────────────
const POSTS_DIR = path.resolve(__dirname, '../public/posts');

function ensureDir() {
  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
}

function readIndex(): any[] {
  const f = path.join(POSTS_DIR, 'index.json');
  try { return JSON.parse(fs.readFileSync(f, 'utf-8')); } catch { return []; }
}

function savePost(post: any) {
  ensureDir();
  fs.writeFileSync(path.join(POSTS_DIR, `${post.slug}.json`), JSON.stringify(post, null, 2));
  const index = readIndex();
  const i = index.findIndex((p: any) => p.slug === post.slug);
  const summary = { id: post.id, title: post.title, slug: post.slug, featuredImage: post.featuredImage, seoTitle: post.seoTitle, seoDescription: post.seoDescription, tags: post.tags, readTime: post.readTime, publishedAt: post.publishedAt, excerpt: post.excerpt };
  if (i >= 0) index[i] = summary; else index.unshift(summary);
  fs.writeFileSync(path.join(POSTS_DIR, 'index.json'), JSON.stringify(index, null, 2));
}

// ── Utilities ────────────────────────────────────────────────────────────────
function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 80) + '-' + Date.now();
}

function stripHtml(html: string) { return html.replace(/<[^>]*>/g, '').trim(); }

function calcReadTime(html: string) {
  return Math.max(1, Math.ceil(stripHtml(html).split(/\s+/).filter(Boolean).length / 200));
}

function verifySig(rawBody: string, header: string) {
  const secret = process.env.JETBLOG_SECRET || '96adff800bf0adb2356b6383db5e19a036ae4a9d4c4695e6b2901f610495bac9';
  const expected = crypto.createHmac('sha256', secret).update(rawBody, 'utf-8').digest('hex');
  try { return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(header, 'hex')); } catch { return false; }
}

// ── Routes ───────────────────────────────────────────────────────────────────
app.get('/api/jetblog', (_req, res) => res.json({ status: 'JetBlog webhook active' }));

app.post('/api/jetblog', (req, res) => {
  const sig = req.headers['x-jetblog-signature'] as string;
  if (!sig) return res.status(401).json({ error: 'Missing signature' });
  if (!verifySig((req as any).rawBody, sig)) return res.status(401).json({ error: 'Invalid signature' });

  let payload: any;
  try { payload = JSON.parse((req as any).rawBody); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }

  if (payload.event === 'article.published' && payload.data) {
    const { title = 'Untitled', content = '', featuredImageUrl, seoTitle, seoDescription, tags } = payload.data;
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
    try { savePost(post); console.log(`✅ Published: "${title}" → /blog/${slug}`); }
    catch (e) { console.error('❌ Save failed:', e); return res.status(500).json({ error: 'Save failed' }); }
  }

  return res.json({ received: true });
});

app.listen(PORT, () => {
  ensureDir();
  console.log(`🚀 JetBlog webhook → http://localhost:${PORT}/api/jetblog`);
});
