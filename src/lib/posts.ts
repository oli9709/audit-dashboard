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

export async function fetchPostIndex(): Promise<BlogPostSummary[]> {
  try {
    const res = await fetch('/posts/index.json', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`/posts/${slug}.json`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}
