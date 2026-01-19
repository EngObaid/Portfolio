import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs, deleteBlog, togglePublishBlog } from '../../api/blog.api';
import type { Blog } from '../../types/blog.types';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  FileText,
  Search,
  Eye,
  EyeOff,
  Filter
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { cn } from '../../lib/utils';

export default function BlogDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const { showToast } = useToast();

  useEffect(() => {
    loadBlogs();
  }, [filterStatus]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const publishedFilter = filterStatus === 'all' ? undefined : filterStatus === 'published';
      const response = await fetchBlogs({ published: publishedFilter, limit: 100 });
      setBlogs(response.blogs);
    } catch (error) {
      console.error('Error loading blogs:', error);
      showToast('Failed to load blogs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await deleteBlog(slug);
      setBlogs(blogs.filter(blog => blog.slug !== slug));
      showToast('Blog post deleted', 'success');
    } catch (error) {
      console.error('Failed to delete blog:', error);
      showToast('Failed to delete blog post', 'error');
    }
  };

  const handleTogglePublish = async (slug: string) => {
    try {
      const updatedBlog = await togglePublishBlog(slug);
      setBlogs(blogs.map(blog => blog.slug === slug ? updatedBlog : blog));
      showToast(
        `Blog post ${updatedBlog.published ? 'published' : 'unpublished'}`,
        'success'
      );
    } catch (error) {
      console.error('Failed to toggle publish:', error);
      showToast('Failed to update blog post', 'error');
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Posts', value: blogs.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Published', value: blogs.filter(b => b.published).length, icon: Eye, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Drafts', value: blogs.filter(b => !b.published).length, icon: EyeOff, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold font-heading tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground font-medium">Manage your blog content</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-12 px-6">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button className="rounded-2xl h-12 shadow-xl shadow-primary/20 px-6" asChild>
            <Link to="/admin/blog/new">
              <Plus className="mr-2 h-5 w-5" /> Create Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-900/50 p-8 rounded-[32px] border border-border/50 shadow-sm flex items-center gap-6 group hover:border-primary/30 transition-all"
          >
            <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110', stat.bg)}>
              <stat.icon className={cn('h-8 w-8', stat.color)} />
            </div>
            <div>
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </span>
              <span className="block text-3xl font-bold mt-1 tracking-tight">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              className="rounded-xl"
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'published' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('published')}
              className="rounded-xl"
            >
              Published
            </Button>
            <Button
              variant={filterStatus === 'draft' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('draft')}
              className="rounded-xl"
            >
              Drafts
            </Button>
          </div>

          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-secondary/40 border border-transparent focus:border-primary/20 focus:bg-background h-10 pl-10 pr-4 rounded-xl text-sm w-full sm:w-64 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white dark:bg-slate-900/50 rounded-[40px] border border-border/50 shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border/30 bg-secondary/20">
                <th className="h-14 px-8 align-middle font-bold text-muted-foreground uppercase tracking-widest text-[10px]">
                  Title
                </th>
                <th className="h-14 px-8 align-middle font-bold text-muted-foreground uppercase tracking-widest text-[10px] hidden md:table-cell">
                  Status
                </th>
                <th className="h-14 px-8 align-middle font-bold text-muted-foreground uppercase tracking-widest text-[10px] hidden lg:table-cell">
                  Published
                </th>
                <th className="h-14 px-8 align-middle font-bold text-muted-foreground uppercase tracking-widest text-[10px] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold">No blog posts yet</p>
                        <p className="text-muted-foreground font-light px-10">
                          Start sharing your thoughts by creating your first blog post.
                        </p>
                      </div>
                      <Button className="rounded-full mt-4" asChild>
                        <Link to="/admin/blog/new">
                          <Plus className="mr-2 h-4 w-4" /> Create First Post
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => {
                  const publishedDate = blog.publishedAt || blog.createdAt;
                  const formattedDate = new Date(publishedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });

                  return (
                    <tr key={blog._id} className="group hover:bg-secondary/20 transition-colors">
                      <td className="p-8 align-middle">
                        <div className="space-y-1 max-w-md">
                          <span className="block font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                            {blog.title}
                          </span>
                          <p className="text-muted-foreground text-sm line-clamp-1">{blog.excerpt}</p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {blog.featured && (
                              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-lg text-[10px] font-black uppercase">
                                Featured
                              </Badge>
                            )}
                            {blog.tags.slice(0, 2).map(tag => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="rounded-lg text-[10px] lowercase px-2 font-medium"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="p-8 align-middle hidden md:table-cell">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublish(blog.slug)}
                          className={cn(
                            'rounded-xl font-bold text-xs uppercase tracking-wider',
                            blog.published
                              ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          )}
                        >
                          {blog.published ? 'Published' : 'Draft'}
                        </Button>
                      </td>
                      <td className="p-8 align-middle hidden lg:table-cell">
                        <span className="text-muted-foreground text-sm">{formattedDate}</span>
                      </td>
                      <td className="p-8 align-middle text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl hover:bg-blue-500/10 hover:text-blue-500 transition-all scale-90 group-hover:scale-100"
                            asChild
                          >
                            <Link to={`/admin/blog/${blog.slug}`} title="Edit Post">
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(blog.slug)}
                            className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all scale-90 group-hover:scale-100"
                            title="Delete Forever"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
