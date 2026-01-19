import { useEffect, useState } from 'react';
import { getProjects } from '../api/projects';
import type { Project } from '../types';
import { Hero } from '../components/home/Hero';
import { ProofStrip } from '../components/home/ProofStrip';
import { FeaturedProjects } from '../components/home/FeaturedProjects';
import { CaseStudyPreview } from '../components/home/CaseStudyPreview';
import { SkillsSection } from '../components/home/SkillsSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { ContactSection } from '../components/home/ContactSection';
import { ArchitectureSection } from '../components/home/ArchitectureSection';
import { Loader2 } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { cn } from '../lib/utils';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(data => {
        // Filter for featured projects, limit to 3
        const featured = data.filter(p => p.featured).slice(0, 3);
        // Fallback if no featured projects
        setProjects(featured.length ? featured : data.slice(0, 3));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const { ref: projectsRef, isVisible: projectsVisible } = useScrollReveal();
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal();
  const { ref: skillRef, isVisible: skillsVisible } = useScrollReveal();
  const { ref: testimonialRef, isVisible: testimonialVisible } = useScrollReveal();
  const { ref: contactRef, isVisible: contactVisible } = useScrollReveal();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Hero />
      <div ref={statsRef} className={cn("reveal", statsVisible && "reveal-visible")}>
        <ProofStrip />
      </div>

      <div className="reveal reveal-visible delay-100">
        <ArchitectureSection />
      </div>
      
      <div ref={projectsRef} className={cn("reveal", projectsVisible && "reveal-visible")} style={{ transitionDelay: '0.1s' }}>
        <FeaturedProjects projects={projects} loading={loading} />
      </div>

      <div className="reveal reveal-visible">
        <CaseStudyPreview />
      </div>

      <div ref={skillRef} className={cn("reveal", skillsVisible && "reveal-visible")} style={{ transitionDelay: '0.2s' }}>
        <SkillsSection />
      </div>

      <div ref={testimonialRef} className={cn("reveal", testimonialVisible && "reveal-visible")}>
        <TestimonialsSection />
      </div>

      <div ref={contactRef} className={cn("reveal", contactVisible && "reveal-visible")}>
        <ContactSection />
      </div>
    </div>
  );

}
