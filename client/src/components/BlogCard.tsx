import type { Blog } from '../types/blog.types';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { cn, getImageUrl } from '../lib/utils';
import { useState } from 'react';
import { Badge } from './ui';

interface BlogCardProps {
  blog: Blog;
  className?: string;
}

export function BlogCard({ blog, className }: BlogCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <article className={cn(
      "group h-full flex flex-col rounded-[32px] border border-border/50 bg-card text-card-foreground shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/20 overflow-hidden",
      className
    )}>
      {/* Cover Image */}
      <div className="aspect-[16/9] w-full overflow-hidden bg-muted relative">
        {blog.coverImage ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 shimmer bg-muted/50" />
            )}
            <img
              src={getImageUrl(blog.coverImage)}
              alt={blog.title}
              onLoad={() => setImageLoaded(true)}
              className={cn(
                "h-full w-full object-cover transition-all duration-1000 group-hover:scale-110",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/5 to-primary/10">
            <span className="text-4xl font-black opacity-20">{blog.title.charAt(0)}</span>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Featured badge */}
        {blog.featured && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-widest shadow-lg">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8 flex-1 flex flex-col">
        {/* Meta Information */}
        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
          </div>
          {blog.readingTime && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{blog.readingTime} min read</span>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="flex justify-between items-start mb-3 gap-4">
          {blog.externalLink ? (
            <a
              href={blog.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading font-black text-2xl group-hover:text-primary transition-colors line-clamp-2 leading-tight"
            >
              {blog.title}
            </a>
          ) : (
            <Link 
              to={`/blog/${blog.slug}`} 
              className="font-heading font-black text-2xl group-hover:text-primary transition-colors line-clamp-2 leading-tight"
            >
              {blog.title}
            </Link>
          )}
          <div className="p-2 rounded-full border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity text-primary flex-shrink-0">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
        
        {/* Excerpt */}
        <p className="text-muted-foreground/80 line-clamp-3 mb-6 font-normal leading-relaxed flex-1">
          {blog.excerpt}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {blog.tags.slice(0, 3).map(tag => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
            >
              {tag}
            </Badge>
          ))}
          {blog.tags.length > 3 && (
            <Badge 
              variant="outline" 
              className="rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
            >
              +{blog.tags.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
