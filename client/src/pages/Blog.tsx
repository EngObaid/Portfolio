import { useState, useEffect } from 'react';
import { BlogCard } from '../components/BlogCard';
import { fetchBlogs } from '../api/blog.api';
import type { Blog } from '../types/blog.types';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Badge } from '../components/ui';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadBlogs();
  }, [searchTerm, selectedTags]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetchBlogs({
        published: true,
        search: searchTerm || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        limit: 100,
      });
      setBlogs(response.blogs);
      
      // Extract all unique tags
      const tags = new Set<string>();
      response.blogs.forEach(blog => {
        blog.tags.forEach(tag => tags.add(tag));
      });
      setAllTags(Array.from(tags).sort());
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Blog
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Thoughts, insights, and stories from my journey in tech
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="container mx-auto px-6 mb-12">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-accent transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span className="font-semibold text-sm">Filters</span>
              {selectedTags.length > 0 && (
                <Badge variant="primary" className="ml-2">{selectedTags.length}</Badge>
              )}
            </button>

            {(searchTerm || selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Tag Filters */}
          {showFilters && allTags.length > 0 && (
            <div className="p-6 rounded-2xl border border-border bg-card">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Filter by Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="container mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-2xl font-bold text-muted-foreground mb-2">No blog posts found</p>
            <p className="text-muted-foreground">
              {searchTerm || selectedTags.length > 0
                ? 'Try adjusting your filters'
                : 'Check back soon for new content!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
