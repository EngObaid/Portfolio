import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Code2, Globe2 } from "lucide-react";
import { Button } from '../ui';
import { HeroParticles } from "./HeroParticles";

export function Hero() {
  const [isCTAHovered, setIsCTAHovered] = useState(false);

  return (
    <section className="relative z-0 overflow-hidden py-32 md:py-48 lg:py-64 flex flex-col justify-center items-center min-h-[85vh]">
      {/* Background Layers Stacking order: Bottom to Top */}
      <div className="absolute inset-0 bg-background -z-30" />
      
      {/* Subtle Background Glows */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none -z-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px]">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] animate-pulse-slow" />
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Premium Particle Background (Top-most background layer) */}
      <HeroParticles isEnergyBoosted={isCTAHovered} />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center space-y-10 max-w-4xl mx-auto">
          
          {/* Name & Professional Title */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight text-foreground">
                Ubeyd Abdirahman Salat
              </h1>
              <p className="text-xl md:text-2xl font-medium text-primary">
                Full-Stack Developer & MVP Specialist
              </p>
            </div>
            
            <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl font-light leading-relaxed">
              I help startups and businesses ship production-ready MVPs in 6 weeks using React and Node.js.
              <span className="block mt-3 text-base md:text-lg font-medium text-foreground">
                6+ production apps • 500K+ users served • 98% uptime since 2023
              </span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 mt-4 w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <Button 
                size="lg" 
                className="h-14 md:h-16 px-10 rounded-full text-base md:text-lg font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
                onMouseEnter={() => setIsCTAHovered(true)}
                onMouseLeave={() => setIsCTAHovered(false)}
                asChild
            >
              <Link to="/projects">
                View Case Studies
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 md:h-16 px-10 rounded-full text-base md:text-lg font-bold border-2 hover:bg-secondary/50 backdrop-blur-md hover:-translate-y-1 transition-all" 
              asChild
            >
              <a href="mailto:contact@ubeydsalat.com?subject=Project Inquiry">
                Schedule a Call
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 hover:opacity-100 transition-opacity duration-500 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 font-bold tracking-tight text-base md:text-lg">
                <Code2 className="h-5 w-5 text-primary" />
                React + Node.js
            </div>
            <div className="flex items-center gap-2 font-bold tracking-tight text-base md:text-lg">
                <Globe2 className="h-5 w-5 text-primary" />
                98% Uptime
            </div>
            <div className="flex items-center gap-2 font-bold tracking-tight text-base md:text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                6-Week Delivery
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

