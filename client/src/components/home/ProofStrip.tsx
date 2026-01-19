import { Container } from '../ui';
import { Rocket, Briefcase, Code, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Stat {
  value: string;
  label: string;
  icon: any;
}

const stats: Stat[] = [
  { value: '6+', label: 'Production Apps', icon: Rocket },
  { value: '500K+', label: 'Users Served', icon: Briefcase },
  { value: '98%', label: 'Uptime (2023-25)', icon: Code },
  { value: '6 Weeks', label: 'Avg. MVP Delivery', icon: Heart },
];

export function ProofStrip() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
      
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div 
                key={index} 
                className={cn(
                    "group relative p-8 rounded-[32px] border border-border/50 bg-white/50 dark:bg-slate-900/30 backdrop-blur-md text-center transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 animate-fade-in-up",
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex p-4 rounded-2xl bg-secondary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="text-3xl md:text-5xl font-heading font-black tracking-tighter text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground/90 font-bold uppercase tracking-widest">
                {stat.label}
              </div>
              
              {/* Decorative line */}
              <div className="mt-6 h-1 w-8 mx-auto rounded-full bg-border group-hover:bg-primary group-hover:w-16 transition-all duration-300" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
