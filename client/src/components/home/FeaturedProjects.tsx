import type { Project } from "../../types";
import { ProjectCard } from "../ProjectCard";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { SkeletonCard } from "../ui/Skeleton";

interface FeaturedProjectsProps {
  projects: Project[];
  loading?: boolean;
}

export function FeaturedProjects({ projects, loading }: FeaturedProjectsProps) {
  return (
    <section className="py-24 relative overflow-hidden">
        {/* Background decorative element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
        
        <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div className="animate-fade-in-up">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
                     <Star className="h-3 w-3 fill-primary" />
                     Work Highlights
                   </div>
                   <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-muted-foreground/50">
                     Featured Projects
                   </h2>
                   <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
                     A carefully curated selection of my recent full-stack applications and digital experiences.
                   </p>
                </div>
                 <Link 
                    to="/projects" 
                    className="group hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-background/50 backdrop-blur-sm hover:bg-secondary/50 hover:border-primary/50 transition-all duration-300 font-medium"
                 >
                    Explore all work
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div 
                          key={project._id} 
                          className="animate-fade-in-up h-full" 
                          style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            <ProjectCard project={project} className="h-full border-primary/5" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 rounded-2xl border border-dashed border-border/50 bg-secondary/5 group transition-all duration-500">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-background border border-border group-hover:border-primary/20 group-hover:bg-primary/5 transition-all mb-6">
                        <Star className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-all" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No projects showcased yet</h3>
                    <p className="text-muted-foreground mb-8">Currently updating my portfolio with my latest work.</p>
                    <Link to="/about" className="text-primary hover:underline font-medium">
                        Learn more about my background
                    </Link>
                </div>
            )}

             <div className="mt-16 text-center md:hidden">
                <Link 
                    to="/projects" 
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
                    View All Work
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    </section>
  )
}

