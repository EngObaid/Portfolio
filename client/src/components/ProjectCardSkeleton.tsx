import { Card } from './ui';
import { cn } from '../lib/utils';

interface ProjectCardSkeletonProps {
  className?: string;
}

export function ProjectCardSkeleton({ className }: ProjectCardSkeletonProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Image skeleton */}
      <div className="aspect-[16/9] w-full bg-muted animate-pulse" />
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
        
        {/* Summary */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-full" />
          <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
        </div>
        
        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded animate-pulse w-16" />
          <div className="h-6 bg-muted rounded animate-pulse w-20" />
          <div className="h-6 bg-muted rounded animate-pulse w-18" />
        </div>
      </div>
    </Card>
  );
}
