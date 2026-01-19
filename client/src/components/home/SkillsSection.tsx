import { Container, Section, Badge } from '../ui';
import { Monitor, Server, Wrench, Palette } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SkillCategory {
  title: string;
  icon: any;
  skills: string[];
  color: string;
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend Development',
    icon: Monitor,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Framer Motion'],
    color: 'text-blue-500 bg-blue-500/10',
  },
  {
    title: 'Backend & Systems',
    icon: Server,
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis'],
    color: 'text-green-500 bg-green-500/10',
  },
  {
    title: 'DevOps & Tools',
    icon: Wrench,
    skills: ['Docker', 'AWS', 'Vercel', 'CI/CD', 'Git'],
    color: 'text-orange-500 bg-orange-500/10',
  },
  {
    title: 'Design & Analytics',
    icon: Palette,
    skills: ['UI/UX Design', 'Figma', 'SEO', 'Performance', 'A/B Testing'],
    color: 'text-purple-500 bg-purple-500/10',
  },
];

export function SkillsSection() {
  return (
    <Section className="relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <Container size="lg">
        <div className="flex flex-col items-center text-center mb-16 space-y-4 animate-fade-in-up">
          <Badge variant="outline" className="rounded-full px-4 py-1 font-bold border-primary/20 text-primary">Technical Expertise</Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
            Advanced Skillset
          </h2>
          <p className="text-muted-foreground/90 text-lg max-w-2xl font-light">
            I leverage a modern technology stack to build robust, scalable, and highly performant digital solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="group relative rounded-[32px] border border-border/50 bg-white dark:bg-slate-900/50 p-8 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300", category.color)}>
                <category.icon className="h-7 w-7" />
              </div>
              
              <h3 className="text-xl font-bold mb-6 font-heading">
                {category.title}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <Badge 
                    key={skillIndex} 
                    variant="secondary" 
                    className="rounded-lg px-2 text-xs font-medium border-border/50 hover:border-primary/30 transition-colors"
                   >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
