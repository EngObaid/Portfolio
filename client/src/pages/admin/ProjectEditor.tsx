import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, Link, useBlocker } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getProjectBySlug } from "../../api/projects";
import { http } from "../../api/http";
import { Loader2, ArrowLeft, Upload, X, Save, Plus, Globe, Github, Layers, Sparkles, ArrowUp, ArrowDown, AlertCircle } from "lucide-react";
import { getImageUrl } from "../../lib/utils";
import { Button, Input, Textarea, Badge, Card, CardContent } from "../../components/ui";
import { useToast } from "../../context/ToastContext";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().optional(),
  description: z.string().optional(),
  featured: z.boolean(),
  tags: z.string().optional(),
  techStack: z.string().optional(),
  githubLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  liveLink: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function ProjectEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(!!slug);
  const [submitting, setSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  
  const [existingCover, setExistingCover] = useState<string | null>(null);
  const [existingScreenshots, setExistingScreenshots] = useState<string[]>([]);
  const [draftFound, setDraftFound] = useState<{data: any, timestamp: string, coverPreview?: string, screenshotPreviews?: string[]} | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      featured: false,
      title: "",
      summary: "",
      description: "",
      tags: "",
      techStack: "",
      githubLink: "",
      liveLink: "",
    },
  });

  const formData = watch();

  useEffect(() => {
    if (slug) {
      getProjectBySlug(slug)
        .then((project) => {
          reset({
            title: project.title,
            summary: project.summary,
            description: project.description,
            featured: project.featured,
            tags: project.tags.join(", "),
            techStack: project.techStack.join(", "),
            githubLink: project.links.github || "",
            liveLink: project.links.live || "",
          });
          setExistingCover(project.coverImage || null);
          setExistingScreenshots(project.screenshots || []);
        })
        .catch(() => {
            showToast("Failed to load project", "error");
            navigate("/admin/projects");
        })
        .finally(() => setLoading(false));
    }
  }, [slug, navigate, reset, showToast]);

  // useBlocker for unsaved changes (React Router 7)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  // Browser-level unsaved changes warning (for refresh/tab close)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Draft persistence keys
  const DRAFT_KEY = `project_draft_${slug || 'new'}`;

  // Check for existing draft on mount
  useEffect(() => {
    if (loading) return;

    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        const draftTime = new Date(parsedDraft.timestamp).toLocaleString();
        
        // Show restoration prompt if draft is newer than last saved or if it's a new project
        // For simplicity, we'll just show it if it exists.
        setDraftFound({ ...parsedDraft, timestamp: draftTime });
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, [loading, slug, DRAFT_KEY]);

  // Debounced Autosave Logic
  useEffect(() => {
    if (!isDirty || submitting) return;

    const timer = setTimeout(() => {
      const draft = {
        data: formData,
        coverPreview,
        screenshotPreviews,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setLastSaved(new Date());
    }, 3000);

    return () => clearTimeout(timer);
  }, [formData, isDirty, submitting, DRAFT_KEY, coverPreview, screenshotPreviews]);

  // Clear draft on successful submission
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
  }, [DRAFT_KEY]);

  const handleRestoreDraft = () => {
    if (!draftFound) return;
    reset(draftFound.data);
    if (draftFound.coverPreview) setCoverPreview(draftFound.coverPreview);
    if (draftFound.screenshotPreviews) setScreenshotPreviews(draftFound.screenshotPreviews);
    showToast("Draft restored!", "info");
    setDraftFound(null);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraftFound(null);
    showToast("Draft discarded", "info");
  };

  const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const onScreenshotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files) {
        const files = Array.from(e.target.files);
        setScreenshots((prev) => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setScreenshotPreviews((prev) => [...prev, ...newPreviews]);
     }
  };

  const removeScreenshot = (index: number) => {
      if (confirm("Are you sure you want to remove this screenshot?")) {
        setScreenshots(prev => prev.filter((_, i) => i !== index));
        setScreenshotPreviews(prev => prev.filter((_, i) => i !== index));
      }
  };

  const moveScreenshot = (index: number, direction: 'up' | 'down') => {
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= screenshotPreviews.length) return;

      setScreenshotPreviews(prev => {
          const updated = [...prev];
          [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
          return updated;
      });

      setScreenshots(prev => {
          const updated = [...prev];
          [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
          return updated;
      });
  };
  
  const onSubmit = async (data: ProjectFormValues) => {
    setSubmitting(true);
    try {
        const payload = new FormData();
        payload.append("title", data.title);
        if (data.summary) payload.append("summary", data.summary);
        if (data.description) payload.append("description", data.description);
        payload.append("featured", String(data.featured));
        
        if (data.tags) {
            data.tags.split(",").map(t => t.trim()).filter(Boolean).forEach(tag => payload.append("tags", tag));
        }
        if (data.techStack) {
            data.techStack.split(",").map(t => t.trim()).filter(Boolean).forEach(tech => payload.append("techStack", tech));
        }
        
        if (data.githubLink) payload.append("links[github]", data.githubLink);
        if (data.liveLink) payload.append("links[live]", data.liveLink);

        if (coverImage) {
            payload.append("coverImage", coverImage);
        }

        screenshots.forEach(file => {
            payload.append("screenshots", file);
        });

        let url = "/api/projects";
        let method = "post";
        
        if (slug) {
            const project = await getProjectBySlug(slug);
            url = `/api/projects/${project._id}`;
            method = "put";
        }

        await http({
            method,
            url,
            data: payload,
            headers: { "Content-Type": "multipart/form-data" },
        });

        clearDraft();
        showToast(slug ? "Project updated!" : "Project created!", "success");
        navigate("/admin/projects");
    } catch (error: any) {
        console.error("Failed to save project", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to save project";
        showToast(errorMessage, "error");
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) {
     return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-32">
      {/* Blocker Modal */}
      {blocker.state === "blocked" && (
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
      {/* Premium Sub-Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border/50">
        <div className="flex items-center gap-6">
            <Link to="/admin/projects">
                <Button variant="outline" size="icon" className="rounded-2xl hover:bg-secondary">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            </Link>
            <div>
                <h1 className="text-3xl font-bold font-heading tracking-tight">
                    {slug ? "Edit Project" : "New Narrative"}
                </h1>
                <p className="text-muted-foreground text-sm font-medium">
                    {slug ? `Refining "${formData.title}"` : "Start a new project journey"}
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
            <Button variant="ghost" onClick={() => navigate("/admin/projects")}>
                Discard
            </Button>
            <Button 
                onClick={handleSubmit(onSubmit)} 
                disabled={submitting} 
                className="rounded-2xl shadow-xl shadow-primary/20 px-8"
            >
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {slug ? "Update Story" : "Publish Project"}
            </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Main Form Fields */}
        <div className="lg:col-span-8 space-y-10">
            <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Layers className="h-4 w-4" />
                    </div>
                    <h2 className="text-xl font-bold">General Information</h2>
                </div>
                
                <div className="space-y-6 bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-border/50 shadow-sm">
                    <Input
                        label="Project Title"
                        {...register("title")}
                        error={errors.title?.message}
                        placeholder="e.g. EcoSphere Dashboard"
                        className="bg-slate-50/50 dark:bg-slate-800/30 border-transparent focus:bg-background"
                    />

                    <Textarea
                        label="Project Summary"
                        {...register("summary")}
                        error={errors.summary?.message}
                        placeholder="A one-sentence hook for the project..."
                        rows={3}
                        className="bg-slate-50/50 dark:bg-slate-800/30 border-transparent focus:bg-background resize-none"
                    />

                    <Textarea
                        label="Detailed Narrative (Markdown)"
                        {...register("description")}
                        error={errors.description?.message}
                        placeholder="Tell the full story of the project..."
                        rows={12}
                        className="bg-slate-50/50 dark:bg-slate-800/30 border-transparent focus:bg-background font-mono text-sm leading-relaxed"
                    />
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Upload className="h-4 w-4" />
                    </div>
                    <h2 className="text-xl font-bold">Visual Assets</h2>
                </div>
                
                <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-border/50 shadow-sm space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-bold block">Cover Image (Featured)</label>
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
                                        <Layers className="h-8 w-8 mb-2" />
                                        <span className="text-xs">No cover image</span>
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Button variant="secondary" size="sm" className="rounded-xl pointer-events-none">Change</Button>
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

                    <div className="space-y-4 pt-6 border-t border-border/30">
                        <label className="text-sm font-bold block">Project Gallery (Screenshots)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {existingScreenshots.map((shot, i) => (
                                <div key={`existing-${i}`} className="group relative aspect-square rounded-2xl overflow-hidden border border-border/50 bg-slate-50 dark:bg-slate-800/30">
                                    <img src={getImageUrl(shot)} alt="Screenshot" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                            
                             {screenshotPreviews.map((preview, i) => (
                                <div key={`new-${i}`} className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 bg-slate-50 dark:bg-slate-800/30 animate-scale-in">
                                    <img src={preview} alt="New Screenshot" className="h-full w-full object-cover" />
                                    
                                    {/* Control Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <div className="flex gap-2">
                                            <button 
                                                type="button"
                                                onClick={() => moveScreenshot(i, 'up')}
                                                disabled={i === 0}
                                                className="p-2 bg-background/90 rounded-full hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                <ArrowUp className="h-4 w-4" />
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => moveScreenshot(i, 'down')}
                                                disabled={i === screenshotPreviews.length - 1}
                                                className="p-2 bg-background/90 rounded-full hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                <ArrowDown className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => removeScreenshot(i)} 
                                            className="p-2 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:scale-110 transition-all font-bold text-xs"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <label className="cursor-pointer flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-border/50 bg-slate-50/50 dark:bg-slate-800/10 hover:bg-slate-50 hover:border-primary/50 transition-all group">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    <Plus className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mt-4">Add Media</span>
                                <input type="file" accept="image/*" multiple onChange={onScreenshotsChange} className="hidden" />
                            </label>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        {/* Sidebar settings */}
        <aside className="lg:col-span-4 space-y-8 animate-fade-in-right">
            <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-border/50 shadow-sm space-y-8">
                <h3 className="text-lg font-bold">Metadata & Links</h3>
                
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                             <Badge variant="secondary" className="rounded-lg px-2"><Github className="h-3 w-3 mr-1" /> Repository</Badge>
                        </div>
                        <Input
                            {...register("githubLink")}
                            placeholder="https://github.com/..."
                            error={errors.githubLink?.message}
                            className="bg-slate-50/50 dark:bg-slate-800/30 border-transparent focus:bg-background"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                             <Badge variant="secondary" className="rounded-lg px-2"><Globe className="h-3 w-3 mr-1" /> Live Preview</Badge>
                        </div>
                        <Input
                            {...register("liveLink")}
                            placeholder="https://..."
                            error={errors.liveLink?.message}
                            className="bg-slate-50/50 dark:bg-slate-800/30 border-transparent focus:bg-background"
                        />
                    </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-border/30">
                    <Input
                        label="Tags"
                        {...register("tags")}
                        error={errors.tags?.message}
                        placeholder="React, Next.js, Framer Motion"
                        className="bg-slate-50/50 dark:bg-slate-800/30 border-transparent focus:bg-background h-12"
                    />

                    <Input
                        label="Tech Stack"
                        {...register("techStack")}
                        error={errors.techStack?.message}
                        placeholder="MongoDB, Express, React, Node"
                        className="bg-slate-50/50 dark:bg-slate-800/30 border-transparent focus:bg-background h-12"
                    />
                </div>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                    <div>
                        <span className="block text-sm font-bold">Featured Project</span>
                        <span className="text-[10px] text-muted-foreground uppercase">Show on Landing Page</span>
                    </div>
                    <input 
                        type="checkbox" 
                        {...register("featured")} 
                        className="h-6 w-6 rounded-lg border-border text-primary focus:ring-primary/20 transition-all" 
                    />
                </div>
            </div>

            <div className="p-6 rounded-3xl bg-secondary/20 border border-border/50 text-center space-y-4">
                <p className="text-sm text-muted-foreground font-light px-4">
                    Once published, this project will be visible to everyone on your public site.
                </p>
                <Link to="/admin" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
                    Return to Dashboard
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
