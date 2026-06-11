import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen, ArrowRight, Rss } from 'lucide-react';
import { fetchPostIndex, formatDate, BlogPostSummary } from '../lib/posts';

function PostCard({ post, index }: { post: BlogPostSummary; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
    >
      <Link to={`/blog/${post.slug}`} className="blog-card">
        <div className="blog-card-img-wrapper">
          {post.featuredImage ? (
            <img src={post.featuredImage} alt={post.title} className="blog-card-img" loading="lazy" />
          ) : (
            <div className="blog-card-img-placeholder"><BookOpen size={36} opacity={0.4} /></div>
          )}
        </div>
        <div className="blog-card-body">
          {post.tags.length > 0 && (
            <div className="blog-card-tags">
              {post.tags.slice(0, 3).map(tag => <span key={tag} className="blog-tag">{tag}</span>)}
            </div>
          )}
          <h2 className="blog-card-title">{post.title}</h2>
          <p className="blog-card-excerpt">{post.excerpt}</p>
          <div className="blog-card-meta">
            <span className="blog-card-meta-item"><Calendar size={13} />{formatDate(post.publishedAt)}</span>
            <span className="blog-card-meta-item"><Clock size={13} />{post.readTime} daqiqa</span>
          </div>
          <div className="blog-card-read-more">O'qish <ArrowRight size={13} /></div>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="blog-empty-state">
      <div className="blog-empty-icon"><Rss size={40} opacity={0.4} /></div>
      <h3 className="blog-empty-title">Tez kunda yangi maqolalar...</h3>
      <p className="blog-empty-sub">Hozircha hech qanday maqola yo'q. Kuzatib boring.</p>
    </motion.div>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Blog | Smart Marketing Audit Dashboard';
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', 'Marketing va biznes o\'sishi haqida eng so\'nggi maqolalar.');
    fetchPostIndex().then(d => { setPosts(d); setLoading(false); });
  }, []);

  return (
    <div className="app-container">
      <div className="atmosphere-orb orb-1" />
      <div className="atmosphere-orb orb-2" />
      <header className="header-section">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="badge-live">
          <Rss size={14} /> JetBlog AI
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="page-title">Blog</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="page-subtitle">
          Marketing, reklama va biznes o'sishi haqida eng so'nggi maqolalar.
        </motion.p>
      </header>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: '2rem' }}>
        <Link to="/" className="blog-back-link">← Dashboard ga qaytish</Link>
      </motion.div>
      {loading ? (
        <div className="blog-loading"><div className="blog-spinner" /></div>
      ) : posts.length === 0 ? <EmptyState /> : (
        <div className="blog-grid">
          {posts.map((p, i) => <PostCard key={p.slug} post={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
