import { Container, Section, Badge } from '../ui';

export function ArchitectureSection() {
  return (
    <Section className="relative overflow-hidden bg-white dark:bg-black py-32">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <Container size="lg" className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-left">
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-bold border-primary/20 text-primary uppercase tracking-widest">
                  Architecture
                </Badge>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tight leading-tight">
              A full-stack ecosystem <br />
              <span className="text-muted-foreground">built for scale.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Every layer of my development stack is optimized for performance, maintainability, and user experience. I build systems, not just websites.
            </p>

            <div className="space-y-6 pt-8 border-t border-border/40">
                <div className="flex gap-4">
                    <div className="w-px h-auto bg-gradient-to-b from-primary/50 to-transparent" />
                    <div>
                        <h4 className="font-bold text-foreground">Frontend Experience</h4>
                        <p className="text-sm text-muted-foreground mt-1">React, Next.js, and framer-motion for buttery smooth interfaces.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-px h-auto bg-gradient-to-b from-primary/50 to-transparent" />
                    <div>
                        <h4 className="font-bold text-foreground">Backend Logic</h4>
                        <p className="text-sm text-muted-foreground mt-1">Node.js and Express REST APIs designed for speed and security.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                     <div className="w-px h-auto bg-gradient-to-b from-primary/50 to-transparent" />
                    <div>
                        <h4 className="font-bold text-foreground">Data Layer</h4>
                        <p className="text-sm text-muted-foreground mt-1">MongoDB and Redis for reliable data persistence and caching.</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Right Visual - Isometric Layers */}
          <div className="relative h-[600px] w-full flex items-center justify-center perspective-[1000px] group">
            
            {/* The Isometric Container */}
            {/* The Isometric Container */}
            <div className="relative w-full h-full transform-style-3d rotate-x-[60deg] rotate-z-[-45deg] scale-75 translate-y-20 transition-transform duration-700 ease-out hover:rotate-x-[55deg] hover:rotate-z-[-40deg]">
                
                {/* Layer 3: Database (Bottom) */}
                <div className="absolute inset-0 top-[200px] z-10">
                    <div className="w-64 h-80 mx-auto bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl animate-float-bottom flex items-center justify-center">
                         <div className="text-slate-400 font-mono text-xs tracking-widest rotate-45 transform">DATABASE</div>
                    </div>
                </div>

                 {/* Layer 2: API (Middle) */}
                 <div className="absolute inset-0 top-[100px] z-20">
                    <div className="w-64 h-80 mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl animate-float-mid flex items-center justify-center">
                        {/* Pattern inside */}
                         <div className="grid grid-cols-2 gap-2 p-4 w-full h-full opacity-20">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-current rounded-lg" />
                            ))}
                         </div>
                    </div>
                </div>

                {/* Layer 1: Frontend (Top - The Blue One) */}
                <div className="absolute inset-0 top-0 z-30">
                     <div className="w-64 h-80 mx-auto bg-blue-500/10 dark:bg-blue-600/10 backdrop-blur-md rounded-3xl border-2 border-blue-500 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] animate-float-top flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                        
                        {/* Cutout puzzle piece effect simulation */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-500 rounded-2xl shadow-lg flex items-center justify-center">
                             <div className="w-12 h-12 bg-white rounded-xl" />
                        </div>
                        
                        {/* Lines */}
                        <div className="absolute inset-0 border-[0.5px] border-blue-500/20 rounded-3xl" />
                     </div>
                </div>

                {/* Connecting Lines (Label Pointers) - Simulated with absolute divs */}
                 <div className="absolute top-[50px] -right-20 z-40 hidden lg:block animate-fade-in delay-700">
                    <div className="flex items-center gap-2">
                        <div className="w-20 h-px bg-blue-500" />
                        <span className="text-xs font-mono text-blue-500 bg-blue-500/10 px-2 py-1 rounded">FRAMEWORK</span>
                    </div>
                </div>

                 <div className="absolute top-[200px] -left-10 z-20 hidden lg:block animate-fade-in delay-1000">
                    <div className="flex items-center gap-2 flex-row-reverse">
                        <div className="w-20 h-px bg-slate-400" />
                        <span className="text-xs font-mono text-slate-500 bg-slate-500/10 px-2 py-1 rounded">API_LAYER</span>
                    </div>
                </div>

            </div>

          </div>
        </div>
      </Container>
    </Section>
  );
}
