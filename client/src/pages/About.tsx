import { Briefcase, GraduationCap, Code2, Heart, Rocket, User, Star } from "lucide-react";
import { Container, Badge, Button } from '../components/ui';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { cn } from '../lib/utils';

export default function About() {
  const experiences = [
    {
      title: "Senior Full Stack Engineer",
      company: "Innovate Digital",
      time: "2022 - Present",
      description: "Leading development of enterprise-scale MERN applications, implementing CI/CD pipelines, and driving UI/UX excellence."
    },
    {
      title: "Frontend Specialist",
      company: "Creative Studio",
      time: "2020 - 2022",
      description: "Crafted high-performance React interfaces and micro-interactions for global brands."
    },
    {
        title: "Freelance Developer",
        company: "Self-Employed",
        time: "2018 - 2020",
        description: "Built custom web solutions for local businesses and startups across the US and Europe."
    }
  ];

  const education = [
    {
      degree: "B.S. in Software Engineering",
      school: "Polytechnic Institute",
      time: "2014 - 2018"
    }
  ];


  const skills = [
    { name: "React", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "Node.js", level: 85 },
    { name: "Tailwind CSS", level: 98 },
    { name: "MongoDB", level: 80 },
    { name: "Express", level: 85 },
  ];

  const { ref: storyRef, isVisible: storyVisible } = useScrollReveal();
  const { ref: philosophyRef, isVisible: philosophyVisible } = useScrollReveal();
  const { ref: sidebarRef, isVisible: sidebarVisible } = useScrollReveal();

  return (
    <article className="pb-32 overflow-hidden">
      {/* Premium Header */}
      <header className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
        </div>
        
        <Container size="lg">
          <div className="max-w-3xl space-y-6 animate-fade-in-up">
            <Badge variant="primary" className="px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              The person behind the code
            </Badge>
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-muted-foreground/50">
              Hi, I'm <span className="text-primary italic">Ubeyd Abdirahman Salat</span>.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl leading-relaxed">
              Full-stack developer specializing in rapid MVP development and scalable web applications.
            </p>
          </div>
        </Container>

      </header>

      <Container size="lg" className="mt-20">
        <div className="grid lg:grid-cols-12 gap-16 md:gap-24">
          
          {/* Story Content */}
          <div 
            ref={storyRef}
            className={cn(
                "lg:col-span-7 space-y-12 reveal",
                storyVisible && "reveal-visible"
            )}
          >
            <section className="space-y-6">
              <h2 className="text-3xl font-heading font-bold flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <User className="h-5 w-5" />
                </span>
                My Journey
              </h2>
              <div className="prose dark:prose-invert max-w-none text-muted-foreground text-lg leading-relaxed space-y-6 font-light">
                <p>
                  I'm Ubeyd Abdirahman Salat, a full-stack developer passionate about building products that solve real problems. My journey in web development has been driven by a simple belief: technology should make people's lives easier, not more complicated.
                </p>
                <p>
                  I specialize in the MERN stack (MongoDB, Express, React, Node.js) and have delivered multiple production applications serving hundreds of thousands of users. What sets me apart is my ability to ship MVPs quickly without sacrificing code quality or scalability.
                </p>
                <p>
                  Beyond writing code, I focus on understanding business problems first. Whether it's improving conversion rates, reducing load times, or building features that users actually need, I approach every project with a results-driven mindset.
                </p>
              </div>
            </section>

            <section 
                ref={philosophyRef}
                className={cn(
                    "grid sm:grid-cols-2 gap-8 reveal",
                    philosophyVisible && "reveal-visible"
                )}
                style={{ transitionDelay: '0.2s' }}
            >
                <div className="p-8 rounded-3xl bg-secondary/20 border border-border/50 hover:border-primary/20 hover:bg-secondary/30 transition-all duration-500 group cursor-default">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                        <Rocket className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Philosophy</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        I believe in "measure twice, cut once." Clean architecture and thoughtful design patterns are the bedrock of any successful long-term project.
                    </p>
                </div>
                <div className="p-8 rounded-3xl bg-secondary/20 border border-border/50 hover:border-primary/20 hover:bg-secondary/30 transition-all duration-500 group cursor-default">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                        <Heart className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Values</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Empathy and communication are as important as technical skill. I value transparency, collaboration, and continuous learning above all else.
                    </p>
                </div>
            </section>
          </div>

          {/* Sidebar: Experience & Skills */}
          <aside 
            ref={sidebarRef}
            className={cn(
                "lg:col-span-5 space-y-12 reveal",
                sidebarVisible && "reveal-visible"
            )}
            style={{ transitionDelay: '0.4s' }}
          >
            
            {/* Experience Timeline */}
            <div className="space-y-8">
              <h3 className="text-2xl font-heading font-bold flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-primary" /> Experience
              </h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:w-px before:bg-border/50">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="relative pl-12 group">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center z-10 group-hover:border-primary transition-colors">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">{exp.time}</span>
                        <h4 className="text-lg font-bold">{exp.title}</h4>
                        <p className="text-sm font-medium text-muted-foreground">{exp.company}</p>
                        <p className="text-sm text-muted-foreground/80 leading-relaxed font-light">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Timeline */}
            <div className="space-y-8 pt-8 border-t border-border/50">
              <h3 className="text-2xl font-heading font-bold flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-primary" /> Education
              </h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:w-px before:bg-border/50">
                {education.map((edu, idx) => (
                  <div key={idx} className="relative pl-12 group">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center z-10 group-hover:border-primary transition-colors">
                      <Star className="w-3 h-3 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">{edu.time}</span>
                        <h4 className="text-lg font-bold">{edu.degree}</h4>
                        <p className="text-sm font-medium text-muted-foreground">{edu.school}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Visualization */}
            <div className="pt-12 border-t border-border/50 space-y-8">
              <h3 className="text-2xl font-heading font-bold flex items-center gap-3">
                <Code2 className="h-5 w-5 text-primary" /> Technical Skills
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {skills.map((skill) => (
                    <div key={skill.name} className="p-4 rounded-2xl bg-secondary/10 border border-border/50 hover:border-primary/20 hover:bg-secondary/20 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold group-hover:text-primary transition-colors">{skill.name}</span>
                            <span className="text-[10px] font-bold text-muted-foreground">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-primary transition-all duration-1000 group-hover:animate-pulse" 
                                style={{ width: `${skill.level}%` }}
                            />
                        </div>
                    </div>
                ))}
              </div>
            </div>

            {/* CTA/Contact info box */}
            <div className="p-8 rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 space-y-6">
                <h3 className="text-2xl font-bold leading-tight">Interested in collaborating?</h3>
                <p className="text-primary-foreground/80 font-light">
                    I'm currently available for freelance opportunities or full-time roles. Let's build something amazing together.
                </p>
                <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl font-bold">
                    Get In Touch
                </Button>
            </div>
          </aside>
        </div>
      </Container>
    </article>
  );
}


