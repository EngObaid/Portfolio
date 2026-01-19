import { Container, Section, Card, CardContent, Badge } from '../ui';
import { Quote, Star, User } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Product Manager',
    company: 'TechCorp',
    content: 'Outstanding work! The project was delivered on time and exceeded our expectations. Great attention to detail and communication throughout.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    company: 'StartupXYZ',
    content: 'A true professional who understands both the technical and business aspects. Highly recommend for any full-stack development needs.',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'Founder',
    company: 'Bloom Agency',
    content: 'Incredible ability to translate complex requirements into smooth, intuitive user interfaces. A joy to work with on multiple projects.',
    rating: 5,
  }
];

export function TestimonialsSection() {
  return (
    <Section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <Container size="lg">
        <div className="flex flex-col items-center text-center mb-16 space-y-4 animate-fade-in-up">
          <Badge variant="primary" className="rounded-full px-4 py-1">Success Stories</Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground/60">
            What People Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl font-light">
            I take pride in building long-lasting relationships based on trust, quality, and exceptional results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className={cn(
                "group relative border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/20 animate-fade-in-up",
                index === 1 ? "md:-translate-y-4 md:hover:-translate-y-6" : ""
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
              
              <CardContent className="pt-10 pb-8 px-8 flex flex-col h-full">
                <Quote className="h-10 w-10 text-primary/10 mb-6 absolute top-8 right-8 group-hover:text-primary/20 transition-colors" />
                
                <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                </div>

                <p className="text-muted-foreground mb-8 italic leading-relaxed font-light relative z-10">
                  "{testimonial.content}"
                </p>
                
                <div className="mt-auto pt-6 border-t border-border/50 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary border border-border overflow-hidden">
                    {testimonial.avatar ? (
                        <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {testimonial.role} at <span className="text-primary/80">{testimonial.company}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

