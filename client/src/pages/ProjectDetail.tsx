import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProjectBySlug } from "../api/projects";
import type { Project } from "../types";
import { Loader2, Github, ExternalLink, ArrowLeft, Calendar, Layers, Clock } from "lucide-react";
import { format } from "date-fns";
import { getImageUrl } from "../lib/utils";
import { Button, Badge } from "../components/ui";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<{ slug: string; title: string } | null>(null);
  const [prevProject, setPrevProject] = useState<{ slug: string; title: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [currentProject, allProjects] = await Promise.all([
          getProjectBySlug(slug),
          import("../api/projects").then(m => m.getProjects())
        ]);
        
        setProject(currentProject);

        if (allProjects && allProjects.length > 1) {
          const currentIndex = allProjects.findIndex(p => p.slug === slug);
          if (currentIndex !== -1) {
            const next = allProjects[(currentIndex + 1) % allProjects.length];
            const prev = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
            
            if (next.slug !== slug) setNextProject({ slug: next.slug, title: next.title });
            if (prev.slug !== slug) setPrevProject({ slug: prev.slug, title: prev.title });
          }
        }
      } catch (err) {
        console.error("Failed to load project details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  if (loading) {
     return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading case study...</p>
            </div>
        </div>
     )
  }

  if (!project) {
    return (
        <div className="container py-32 text-center animate-fade-in">
            <h1 className="text-3xl font-bold mb-4">Project not found</h1>
            <p className="text-muted-foreground mb-8 text-lg">The project you're looking for doesn't exist or has been moved.</p>
            <Button asChild>
                <Link to="/projects">Back to Projects</Link>
            </Button>
        </div>
    )
  }

  return (
    <article className="min-h-screen">
      {/* Hero Section */}
      <header className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-slate-950">
        {project.coverImage ? (
          <>
            <img 
                src={getImageUrl(project.coverImage)} 
                alt={project.title} 
                className="w-full h-full object-cover opacity-60 scale-105 animate-fade-in"
                style={{ animationDuration: '2s' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-background to-background" />
        )}
        
        <div className="absolute inset-0 flex items-end">
            <div className="container px-4 mx-auto mb-12 md:mb-20">
                <Link to="/projects" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 mb-8 transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Projects
                </Link>
                
                <div className="max-w-4xl space-y-6 animate-fade-in-up">
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                            <Badge key={tag} variant="primary" className="bg-primary/20 backdrop-blur-md border-primary/30 text-primary-foreground">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-white leading-none">
                        {project.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl leading-relaxed">
                        {project.summary}
                    </p>
                </div>
            </div>
        </div>
      </header>

      {/* Case Study Content */}
      <div className="container px-4 mx-auto -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <main className="lg:col-span-8 space-y-16 py-12">
                
                {/* Visual Stats Bar (Mobile) */}
                <div className="lg:hidden grid grid-cols-2 gap-4 pb-8 border-b border-border/50">
                    <div className="space-y-1">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Date</span>
                        <p className="font-medium">{project.createdAt ? format(new Date(project.createdAt), 'MMMM yyyy') : 'Recent'}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Category</span>
                        <p className="font-medium text-primary">{project.tags[0] || 'Web Development'}</p>
                    </div>
                </div>

                <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="space-y-16">
                        {/* We could split project.description here if we wanted to enforce a structure, 
                            but for now let's just enhance the prose styling for a more narrative feel. */}
                        <div className="prose dark:prose-invert max-w-none text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap font-light 
                                      prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground prose-headings:mt-12 prose-headings:mb-6
                                      prose-h2:text-3xl prose-h2:flex prose-h2:items-center prose-h2:gap-4
                                      prose-h2:before:content-[''] prose-h2:before:w-1 prose-h2:before:h-8 prose-h2:before:bg-primary prose-h2:before:rounded-full">
                            {project.description}
                        </div>
                    </div>
                </section>

                {project.screenshots && project.screenshots.length > 0 && (
                    <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-3xl font-heading font-bold mb-10 flex items-center gap-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20">02</span>
                            Visual Showcase
                        </h2>
                        <div className="grid grid-cols-1 gap-12">
                            {project.screenshots.map((shot, idx) => (
                                <div key={idx} className="group relative rounded-2xl overflow-hidden border border-border/50 bg-card shadow-2xl transition-all duration-500 hover:border-primary/20">
                                    <img 
                                        src={getImageUrl(shot)} 
                                        alt={`Work preview ${idx + 1}`} 
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                                    />
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Next/Prev Navigation */}
                {(prevProject || nextProject) && (
                    <section className="pt-24 border-t border-border/30 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                        {prevProject ? (
                            <Link to={`/projects/${prevProject.slug}`} className="group p-8 rounded-3xl border border-border/50 bg-secondary/10 hover:bg-secondary/20 transition-all hover:-translate-y-1">
                                <span className="flex items-center text-xs font-bold text-primary uppercase tracking-widest mb-2">
                                    <ArrowLeft className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" /> Previous Project
                                </span>
                                <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{prevProject.title}</h4>
                            </Link>
                        ) : <div />}
                        
                        {nextProject ? (
                            <Link to={`/projects/${nextProject.slug}`} className="group p-8 rounded-3xl border border-border/50 bg-secondary/10 hover:bg-secondary/20 transition-all hover:-translate-y-1 text-right">
                                <span className="flex items-center justify-end text-xs font-bold text-primary uppercase tracking-widest mb-2">
                                    Next Project <ArrowLeft className="ml-2 h-3 w-3 rotate-180 transition-transform group-hover:translate-x-1" />
                                </span>
                                <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{nextProject.title}</h4>
                            </Link>
                        ) : <div />}
                    </section>
                )}

                <section className="pt-16 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-border/50 mt-16">
                    <div className="space-y-2 text-center sm:text-left">
                        <h3 className="text-2xl font-bold">Interested in working together?</h3>
                        <p className="text-muted-foreground">Let's discuss how I can help with your next project.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" size="lg" className="rounded-full gap-2" asChild>
                            <Link to="/contact">Get in Touch</Link>
                        </Button>
                        {project.links.github && (
                            <Button asChild size="lg" className="rounded-full shadow-xl shadow-primary/20">
                                <a href={project.links.github} target="_blank" rel="noreferrer">
                                    <Github className="mr-2 h-4 w-4" /> View Source
                                </a>
                            </Button>
                        )}
                    </div>
                </section>
            </main>

            {/* Sidebar Details */}
            <aside className="lg:col-span-4 lg:py-12">
                <div className="sticky top-24 space-y-8 animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
                    
                    {/* Project Meta Card */}
                    <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 shadow-xl shadow-primary/5 space-y-8">
                        <div>
                            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-6">Execution Details</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-muted-foreground font-medium uppercase tracking-wider">Completed</span>
                                        <span className="font-semibold">{project.createdAt ? format(new Date(project.createdAt), 'MMMM yyyy') : 'Current'}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                        <Layers className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-muted-foreground font-medium uppercase tracking-wider">Stack</span>
                                        <span className="font-semibold">{project.techStack?.length || 0} Technologies</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {project.techStack && project.techStack.length > 0 && (
                            <div className="pt-8 border-t border-border/50">
                                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-6">Technologies Used</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map(tech => (
                                        <Badge key={tech} variant="secondary" className="px-3 py-1 bg-secondary/50 text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-default border-transparent">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-8 border-t border-border/50 space-y-4">
                            {project.links.live && (
                                <Button asChild size="lg" className="w-full rounded-2xl h-14 font-bold text-lg shadow-xl shadow-primary/20">
                                    <a href={project.links.live} target="_blank" rel="noreferrer">
                                        <ExternalLink className="mr-3 h-5 w-5" /> Live Preview
                                    </a>
                                </Button>
                            )}
                            {project.links.github && (
                                <Button asChild variant="outline" size="lg" className="w-full rounded-2xl h-14 font-bold text-lg hover:bg-slate-900">
                                    <a href={project.links.github} target="_blank" rel="noreferrer">
                                        <Github className="mr-3 h-5 w-5" /> Source Code
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl border border-border/50 bg-secondary/10 flex flex-col items-center justify-center text-center gap-2">
                            <Clock className="h-6 w-6 text-primary mb-1" />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Duration</span>
                            <span className="text-sm font-bold">4 Weeks</span>
                        </div>
                        <div className="p-6 rounded-3xl border border-border/50 bg-secondary/10 flex flex-col items-center justify-center text-center gap-2">
                            <ArrowLeft className="h-6 w-6 text-primary mb-1 rotate-135" />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Role</span>
                            <span className="text-sm font-bold">Lead Developer</span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
      </div>
      
      {/* Bottom Spacer */}
      <div className="h-32" />
    </article>
  );
}

