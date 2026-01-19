import type { Project } from "../types";
import { Link } from "react-router-dom";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";
import { cn, getImageUrl } from "../lib/utils";
import { useState } from "react";
import { Badge } from "./ui";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={cn(
        "group h-full flex flex-col rounded-[32px] border border-border/50 bg-card text-card-foreground shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/20 overflow-hidden", 
        className
    )}>
      <div className="aspect-video w-full overflow-hidden bg-muted relative">
        {project.coverImage ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 shimmer bg-muted/50" />
            )}
            <img
              src={getImageUrl(project.coverImage)}
              alt={project.title}
              onLoad={() => setImageLoaded(true)}
              className={cn(
                "h-full w-full object-cover transition-all duration-1000 group-hover:scale-110",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground bg-secondary/30">
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}
        
        {/* Hover overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
            <div className="flex flex-col w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex gap-3">
                    {project.links.github && (
                        <a href={project.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 text-white text-xs font-bold backdrop-blur-md hover:bg-white hover:text-slate-950 transition-all duration-300">
                            <Github className="h-3.5 w-3.5" />
                            GITHUB
                        </a>
                    )}
                    {project.links.live && (
                        <a href={project.links.live} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300">
                            <ExternalLink className="h-3.5 w-3.5" />
                            LIVE DEMO
                        </a>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        {/* Impact Metrics - PRIORITY SECTION */}
        {project.impact?.metrics && project.impact.metrics.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="grid grid-cols-2 gap-4">
              {project.impact.metrics.slice(0, 2).map((metric, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-primary mb-1">
                    {metric.value}
                  </div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Title */}
        <div className="flex justify-between items-start mb-3 gap-4">
           <Link to={`/projects/${project.slug}`} className="font-heading font-black text-2xl group-hover:text-primary transition-colors line-clamp-1 leading-tight">
             {project.title}
           </Link>
           <div className="p-2 rounded-full border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                <ArrowUpRight className="h-5 w-5" />
           </div>
        </div>
        
        {/* Challenge/Solution OR Summary */}
        {project.challenge ? (
          <div className="space-y-3 mb-6 flex-1">
            <p className="text-sm">
              <span className="font-bold text-orange-600 dark:text-orange-400">Challenge:</span>{' '}
              <span className="text-muted-foreground/90">{project.challenge}</span>
            </p>
            {project.solution && (
              <p className="text-sm">
                <span className="font-bold text-green-600 dark:text-green-400">Solution:</span>{' '}
                <span className="text-muted-foreground/90">{project.solution}</span>
              </p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground/80 line-clamp-2 mb-6 font-normal leading-relaxed flex-1">
            {project.summary}
          </p>
        )}
        
        {/* Tech Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tags.slice(0, 4).map(tag => (
            <Badge key={tag} variant="secondary" className="rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
