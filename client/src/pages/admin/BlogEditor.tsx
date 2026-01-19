import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link, useBlocker } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchBlogBySlug, createBlog, updateBlog } from '../../api/blog.api';
import { Loader2, ArrowLeft, Upload, Save, Sparkles, FileText, AlertCircle, X } from 'lucide-react';
import { getImageUrl } from '../../lib/utils';
import { Button, Input, Textarea, Card, CardContent } from '../../components/ui';
import { useToast } from '../../context/ToastContext';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  externalLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  tags: z.string().optional(),
  categories: z.string().optional(),
  featured: z.boolean(),
  published: z.boolean(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export default function BlogEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(!!slug);
  const [submitting, setSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [existingCover, setExistingCover] = useState<string | null>(null);
  const [draftFound, setDraftFound] = useState<{data: any, timestamp: string, coverPreview?: string} | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      externalLink: '',
      tags: '',
      categories: '',
      featured: false,
      published: false,
      metaDescription: '',
      metaKeywords: '',
    },
  });

  const formData = watch();

  useEffect(() => {
    if (slug) {
      fetchBlogBySlug(slug)
        .then((blog) => {
          reset({
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            externalLink: blog.externalLink || '',
            tags: blog.tags.join(', '),
            categories: blog.categories?.join(', ') || '',
            featured: blog.featured,
            published: blog.published,
            metaDescription: blog.seo?.metaDescription || '',
            metaKeywords: blog.seo?.metaKeywords?.join(', ') || '',
          });
          setExistingCover(blog.coverImage || null);
        })
        .catch(() => {
          showToast('Failed to load blog post', 'error');
          navigate('/admin/blog');
        })
        .finally(() => setLoading(false));
    }
  }, [slug, navigate, reset, showToast]);

  // useBlocker for unsaved changes
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  // Browser-level unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Draft persistence
  const DRAFT_KEY = `blog_draft_${slug || 'new'}`;

  useEffect(() => {
    if (loading) return;

    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        const draftTime = new Date(parsedDraft.timestamp).toLocaleString();
        setDraftFound({ ...parsedDraft, timestamp: draftTime });
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  }, [loading, slug, DRAFT_KEY]);

  // Debounced Autosave
  useEffect(() => {
    if (!isDirty || submitting) return;

    const timer = setTimeout(() => {
      const draft = {
        data: formData,
        coverPreview,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setLastSaved(new Date());
    }, 3000);

    return () => clearTimeout(timer);
  }, [formData, isDirty, submitting, DRAFT_KEY, coverPreview]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
  }, [DRAFT_KEY]);

  const handleRestoreDraft = () => {
    if (!draftFound) return;
    reset(draftFound.data);
    if (draftFound.coverPreview) setCoverPreview(draftFound.coverPreview);
    showToast('Draft restored!', 'info');
    setDraftFound(null);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraftFound(null);
    showToast('Draft discarded', 'info');
  };

  const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: BlogFormValues) => {
    setSubmitting(true);
    try {
      const blogData = {
        title: data.title,
        excerpt: data.excerpt || "",
        content: data.content || "",
        externalLink: data.externalLink || undefined,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        categories: data.categories?.split(',').map(c => c.trim()).filter(Boolean) || [],
        featured: data.featured,
        published: data.published,
        seo: {
          metaDescription: data.metaDescription || undefined,
          metaKeywords: data.metaKeywords?.split(',').map(k => k.trim()).filter(Boolean) || [],
        },
      };

      // Note: Image upload would need to be handled separately through a file upload endpoint
      // For now, we're not including coverImage in the submission
      // You may want to add a separate image upload endpoint similar to projects

      if (slug) {
        await updateBlog(slug, blogData);
        showToast('Blog post updated!', 'success');
      } else {
        await createBlog(blogData);
        showToast('Blog post created!', 'success');
      }

      clearDraft();
      navigate('/admin/blog');
    } catch (error: any) {
      console.error('Failed to save blog:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to save blog post';
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-32">
      {/* Blocker Modal */}
      {blocker.state === 'blocked' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background border border-border p-8 rounded-3xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold mb-4">Unsaved Changes</h3>
            <p className="text-muted-foreground mb-8">
              You have unsaved changes that will be lost. Are you sure you want to leave this page?
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl"
                onClick={() => blocker.reset?.()}
              >
                Stay and Save
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-2xl"
                onClick={() => blocker.proceed?.()}
              >
                Leave Anyway
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border/50">
        <div className="flex items-center gap-6">
          <Link to="/admin/blog">
            <Button variant="outline" size="icon" className="rounded-2xl hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-heading tracking-tight">
              {slug ? 'Edit Blog Post' : 'New Blog Post'}
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              {slug ? `Editing "${formData.title}"` : 'Share your thoughts with the world'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {lastSaved && (
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-muted-foreground/60 transition-all animate-fade-in">
              <Sparkles className="h-3 w-3" />
              Autosaved {lastSaved.toLocaleTimeString()}
            </div>
          )}
          <Button variant="ghost" onClick={() => navigate('/admin/blog')}>
            Discard
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={submitting}
            className="rounded-2xl shadow-xl shadow-primary/20 px-8"
          >
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {slug ? 'Update Post' : 'Publish Post'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Main Form */}
        <div className="lg:col-span-8 space-y-10">
          {/* General Information */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold">Blog Content</h2>
            </div>

            <div className="space-y-6 bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-border/50 shadow-sm">
              <Input
                label="Post Title"
                {...register('title')}
                error={errors.title?.message}
                placeholder="e.g. Building a Modern Web Application"
                className="bg-slate-50/50 dark:bg-slate-800/30 border-transparent focus:bg-background"
              />

              <Textarea
                label="Excerpt"
                {...register('excerpt')}
                error={errors.excerpt?.message}
                placeholder="A brief summary of your blog post..."
                rows={3}
                className="bg-slate-50/50 dark:bg-slate-800/30 border-transparent focus:bg-background resize-none"
              />

              <Input
                label="External Link (Optional)"
                {...register('externalLink')}
                error={errors.externalLink?.message}
                placeholder="https://example.com/article"
                className="bg-slate-50/50 dark:bg-slate-800/30 border-transparent focus:bg-background"
              />

              <Textarea
                label="Content (Markdown Supported)"
                {...register('content')}
                error={errors.content?.message}
                placeholder="Write your blog content here. Markdown is supported for formatting..."
                rows={20}
                className="bg-slate-50/50 dark:bg-slate-800/30 border-transparent focus:bg-background font-mono text-sm leading-relaxed"
              />
            </div>
          </section>

          {/* Cover Image */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Upload className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold">Cover Image</h2>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-border/50 shadow-sm">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative w-full md:w-64 aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-border/50 group bg-slate-50 dark:bg-slate-800/30">
                  {(coverPreview || existingCover) ? (
                    <img
                      src={coverPreview || getImageUrl(existingCover)}
                      alt="Cover"
                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40">
                      <Upload className="h-8 w-8 mb-2" />
                      <span className="text-xs">No cover image</span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Button variant="secondary" size="sm" className="rounded-xl pointer-events-none">
                      Change
                    </Button>
                    <input type="file" accept="image/*" onChange={onCoverChange} className="hidden" />
                  </label>
                </div>
                <div className="flex-1 text-sm text-muted-foreground space-y-2">
                  <p className="font-bold text-foreground">Recommendations:</p>
                  <ul className="list-disc pl-5 space-y-1 font-light">
                    <li>Aspect ratio: 16:9</li>
                    <li>Minimum width: 1280px</li>
                    <li>Format: JPG, PNG, WebP</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-border/50 shadow-sm space-y-8">
            <h3 className="text-lg font-bold">Settings</h3>

            <div className="space-y-6">
              <Input
                label="Tags (comma-separated)"
                {...register('tags')}
                error={errors.tags?.message}
                placeholder="React, TypeScript, Web Dev"
                className="bg-slate-50/50 dark:bg-slate-800/30 border-transparent focus:bg-background"
              />

              <Input
                label="Categories (comma-separated)"
                {...register('categories')}
                error={errors.categories?.message}
                placeholder="Tutorial, Opinion"
                className="bg-slate-50/50 dark:bg-slate-800/30 border-transparent focus:bg-background"
              />
            </div>

            <div className="space-y-4 pt-6 border-t border-border/30">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                <div>
                  <span className="block text-sm font-bold">Featured Post</span>
                  <span className="text-[10px] text-muted-foreground uppercase">
                    Show on homepage
                  </span>
                </div>
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="h-6 w-6 rounded-lg border-border text-primary focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 flex items-center justify-between">
                <div>
                  <span className="block text-sm font-bold">Published</span>
                  <span className="text-[10px] text-muted-foreground uppercase">
                    Visible to public
                  </span>
                </div>
                <input
                  type="checkbox"
                  {...register('published')}
                  className="h-6 w-6 rounded-lg border-border text-green-500 focus:ring-green-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-border/50 shadow-sm space-y-6">
            <h3 className="text-lg font-bold">SEO</h3>

            <Input
              label="Meta Description"
              {...register('metaDescription')}
              error={errors.metaDescription?.message}
              placeholder="Brief description for search engines"
              className="bg-slate-50/50 dark:bg-slate-800/30 border-transparent focus:bg-background"
            />

            <Input
              label="Meta Keywords (comma-separated)"
              {...register('metaKeywords')}
              error={errors.metaKeywords?.message}
              placeholder="web development, tutorial"
              className="bg-slate-50/50 dark:bg-slate-800/30 border-transparent focus:bg-background"
            />
          </div>

          <div className="p-6 rounded-3xl bg-secondary/20 border border-border/50 text-center space-y-4">
            <p className="text-sm text-muted-foreground font-light px-4">
              Published posts will be visible to everyone on your blog.
            </p>
            <Link
              to="/admin/blog"
              className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
            >
              Return to Blog Dashboard
            </Link>
          </div>
        </aside>
      </div>

      {/* Draft Alert */}
      {draftFound && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <Card className="w-96 border-primary/20 shadow-2xl shadow-primary/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-xl text-primary mt-1">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-sm">Unsaved Draft Found</h4>
                  <p className="text-xs text-muted-foreground">
                    A draft from <span className="font-medium text-foreground">{draftFound.timestamp}</span> was found.
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      onClick={handleRestoreDraft}
                      className="h-8 text-xs rounded-lg"
                    >
                      Restore
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleDiscardDraft}
                      className="h-8 text-xs rounded-lg hover:bg-secondary"
                    >
                      Discard
                    </Button>
                  </div>
                </div>
                <button 
                  onClick={() => setDraftFound(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
