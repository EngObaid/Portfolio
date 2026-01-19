import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBlogBySlug } from '../api/blog.api';
import type { Blog } from '../types/blog.types';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { Badge } from '../components/ui';
import { getImageUrl } from '../lib/utils';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadBlog(slug);
    }
  }, [slug]);

  const loadBlog = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBlogBySlug(slug);
      setBlog(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Blog post not found');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-t-2 border-primary animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">{error || 'The blog post you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold hover:scale-105 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-8">
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Blog</span>
        </button>
      </div>

      {/* Hero Section */}
      <article className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Featured Badge */}
          {blog.featured && (
            <div className="mb-6">
              <Badge variant="default" className="px-4 py-2 text-xs font-bold uppercase tracking-widest">
                Featured Post
              </Badge>
            </div>
          )}

          {/* Title */}
          <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{formatDate(blog.publishedAt || blog.createdAt)}</span>
            </div>
            {blog.readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{blog.readingTime} min read</span>
              </div>
            )}
            {blog.author && (
              <div className="flex items-center gap-2">
                <span className="text-sm">By <span className="font-semibold">{blog.author.username}</span></span>
              </div>
            )}
          </div>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl mb-12">
              <img
                src={getImageUrl(blog.coverImage)}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Excerpt */}
          <div className="mb-12 p-6 rounded-2xl border-l-4 border-primary bg-primary/5">
            <p className="text-xl leading-relaxed text-foreground/90 italic">
              {blog.excerpt}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <div className="whitespace-pre-wrap leading-relaxed text-foreground/90">
              {blog.content}
            </div>
          </div>

          {/* Tags Section */}
          {blog.tags.length > 0 && (
            <div className="pt-8 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                  Tags
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-4 py-2 text-sm font-semibold rounded-lg"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {blog.categories && blog.categories.length > 0 && (
            <div className="pt-8 border-t border-border mt-8">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                  Categories
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {blog.categories.map(category => (
                  <Badge
                    key={category}
                    variant="outline"
                    className="px-4 py-2 text-sm font-semibold rounded-lg"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Back to Blog CTA */}
      <div className="container mx-auto px-6 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-primary/20"
          >
            <ArrowLeft className="h-5 w-5" />
            View All Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
