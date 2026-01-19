import { Link } from 'react-router-dom';
import { Container, Section, Button, Badge } from '../ui';
import { ArrowRight, CheckCircle2, Sparkles, Zap, Target } from 'lucide-react';

export function CaseStudyPreview() {
  return (
    <Section className="relative overflow-hidden py-32 bg-slate-50 dark:bg-slate-900/20">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none -z-10" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <Container size="lg">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in-left">
            <div className="space-y-4">
              <Badge variant="secondary" className="rounded-full px-4 py-1.5 font-bold flex items-center gap-2 w-fit">
                <Sparkles className="h-4 w-4 text-primary" />
                Featured Project
              </Badge>
              <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight leading-tight">
                Modern Portfolio <br />
                <span className="text-primary">Ecosystem</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-light">
                Developed a comprehensive, high-performance portfolio system that combines dynamic content management with a premium user experience.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Target className="h-5 w-5" />
                </div>
                <h3 className="font-bold">The Challenge</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bridge the gap between technical complexity and intuitive administration.
                </p>
              </div>
              <div className="space-y-3 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-bold">The Solution</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A MERN-stack architecture with robust security and a unified design system.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>90% faster content update cycles</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>100% Lighthouse Performance Score</span>
              </div>
            </div>

            <div className="pt-4">
              <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20 hover:scale-105 transition-all" asChild>
                <Link to="/projects">
                  Explore Full Case Study <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative animate-fade-in-right">
             {/* Mockup Frame */}
            <div className="relative rounded-[40px] border-[8px] border-slate-900 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 shadow-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[600px] transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-slate-200 dark:to-slate-900" />
                
                {/* Simulated UI Content */}
                <div className="absolute inset-4 rounded-3xl bg-white dark:bg-slate-950 shadow-inner overflow-hidden flex flex-col">
                    <div className="h-12 border-b border-border/50 flex items-center px-6 gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                    <div className="p-8 space-y-8 overflow-hidden flex-1">
                        <div className="flex gap-6">
                            <div className="w-1/3 aspect-[4/3] rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
                            <div className="flex-1 space-y-4">
                                <div className="h-6 w-3/4 rounded-lg bg-slate-100 dark:bg-slate-900 animate-pulse" />
                                <div className="h-4 w-full rounded-lg bg-slate-50 dark:bg-slate-900 animate-pulse" />
                                <div className="h-4 w-1/2 rounded-lg bg-slate-50 dark:bg-slate-900 animate-pulse" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                             <div className="aspect-[4/3] rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse" style={{ animationDelay: '0.2s' }} />
                             <div className="aspect-[4/3] rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                         <div className="h-32 w-full rounded-3xl bg-slate-50 dark:bg-slate-900 animate-pulse" style={{ animationDelay: '0.6s' }} />
                    </div>
                </div>
            </div>
            
            {/* Drifting Element */}
            <div className="absolute -bottom-6 -left-12 p-6 rounded-3xl bg-white dark:bg-slate-800 shadow-2xl border border-border/50 animate-bounce-slow hidden xl:block">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Zap className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-sm font-bold">Real-time Performance</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Analytics Dashboard</div>
                    </div>
                </div>
            </div>

            {/* Decorative blobs */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse-slow" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -z-10 animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
