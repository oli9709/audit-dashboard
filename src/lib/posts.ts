export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: string | null;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  readTime: number;
  publishedAt: string;
  createdAt: string;
  excerpt: string;
}

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  featuredImage: string | null;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  readTime: number;
  publishedAt: string;
  excerpt: string;
}

// Use /api/posts on Render (live), fallback to static JSON locally
const API_BASE = '/api/posts';

export async function fetchPostIndex(): Promise<BlogPostSummary[]> {
  try {
    // Try live API first (Render)
    const res = await fetch(API_BASE, { cache: 'no-store' });
    if (res.ok) return res.json();
    // Fallback: static file (local dev)
    const r2 = await fetch('/posts/index.json', { cache: 'no-store' });
    if (!r2.ok) return [];
    return r2.json();
  } catch { return []; }
}

export async function fetchPost(slug: string): Promise<BlogPost | null> {
  try {
    // Try live API first (Render)
    const res = await fetch(`${API_BASE}/${slug}`, { cache: 'no-store' });
    if (res.ok) return res.json();
    // Fallback: static file (local dev)
    const r2 = await fetch(`/posts/${slug}.json`, { cache: 'no-store' });
    if (!r2.ok) return null;
    return r2.json();
  } catch { return null; }
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}
