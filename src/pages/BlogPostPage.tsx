import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, ChevronRight, BookOpen, Tag } from 'lucide-react';
import { fetchPost, formatDate, BlogPost } from '../lib/posts';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null | 'loading'>('loading');

  useEffect(() => {
    if (!slug) { setPost(null); return; }
    fetchPost(slug).then(d => {
      setPost(d);
      if (d) {
        document.title = `${d.seoTitle || d.title} | Blog`;
        let m = document.querySelector('meta[name="description"]');
        if (!m) { m = document.createElement('meta'); (m as HTMLMetaElement).name = 'description'; document.head.appendChild(m); }
        m.setAttribute('content', d.seoDescription || d.excerpt);
      } else { document.title = 'Maqola topilmadi | Blog'; }
    });
    return () => { document.title = 'Smart Marketing Budget & Audit Dashboard'; };
  }, [slug]);

  if (post === 'loading') return (
    <div className="app-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="atmosphere-orb orb-1" /><div className="atmosphere-orb orb-2" />
      <div className="blog-loading"><div className="blog-spinner" /></div>
    </div>
  );

  if (!post) return (
    <div className="app-container">
      <div className="atmosphere-orb orb-1" /><div className="atmosphere-orb orb-2" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="blog-empty-state" style={{ marginTop: '6rem' }}>
        <div className="blog-empty-icon"><BookOpen size={44} opacity={0.4} /></div>
        <h1 className="blog-empty-title" style={{ fontSize: '2rem' }}>404 — Maqola topilmadi</h1>
        <p className="blog-empty-sub">Bu sahifa mavjud emas yoki o'chirilgan.</p>
        <Link to="/blog" className="blog-back-link" style={{ marginTop: '1.5rem' }}>← Blog ga qaytish</Link>
      </motion.div>
    </div>
  );

  return (
    <div>
      <div className="atmosphere-orb orb-1" /><div className="atmosphere-orb orb-2" />
      {/* Hero */}
      <div className="blog-post-hero">
        {post.featuredImage
          ? <img src={post.featuredImage} alt={post.title} className="blog-post-hero-img" />
          : <div className="blog-post-hero-placeholder"><BookOpen size={60} opacity={0.25} /></div>}
        <div className="blog-post-hero-overlay" />
      </div>

      <div className="app-container">
        {/* Breadcrumb */}
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="blog-breadcrumb">
          <Link to="/" className="blog-breadcrumb-link">Bosh sahifa</Link>
          <ChevronRight size={13} opacity={0.5} />
          <Link to="/blog" className="blog-breadcrumb-link">Blog</Link>
          <ChevronRight size={13} opacity={0.5} />
          <span className="blog-breadcrumb-current">{post.title}</span>
        </motion.nav>

        <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="blog-post-article">
          <h1 className="blog-post-title">{post.title}</h1>
          <div className="blog-post-meta-row">
            <span className="blog-card-meta-item"><Calendar size={14} />{formatDate(post.publishedAt)}</span>
            <span className="blog-card-meta-item"><Clock size={14} />{post.readTime} daqiqa o'qish</span>
            {post.tags.length > 0 && (
              <span className="blog-post-tags"><Tag size={12} />{post.tags.map(t => <span key={t} className="blog-tag">{t}</span>)}</span>
            )}
          </div>
          <div className="blog-post-divider" />
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </motion.article>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ marginTop: '3rem', paddingBottom: '4rem' }}>
          <Link to="/blog" className="blog-back-link"><ChevronLeft size={15} />Blog ga qaytish</Link>
        </motion.div>
      </div>
    </div>
  );
}
