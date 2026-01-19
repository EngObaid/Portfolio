import { useState } from "react";
import { createMessage } from "../../api/messages";
import { CheckCircle2, Mail, MapPin, Send, MessageSquare, Globe, Clock } from "lucide-react";
import { Input, Textarea, Button, Container, Badge } from '../ui';
import { useToast } from '../../context/ToastContext';

export function ContactSection() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createMessage(formData);
            setSuccess(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
            showToast("Message sent successfully!", "success");
        } catch (error) {
            console.error("Failed to send message", error);
            showToast("Failed to send message. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-slate-950/50">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <Container size="lg">
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <Badge variant="primary" className="rounded-full px-4 py-1">Connect with me</Badge>
          <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-foreground">
            Let's Start a <span className="gradient-text">Conversation</span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-light">
            I'm always open to discussing new projects, creative ideas or freelance opportunities.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Info Sidebar */}
            <div className="lg:col-span-5 space-y-6 animate-fade-in-left">
                <div className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-8 space-y-8 shadow-xl">
                    <h3 className="text-2xl font-bold font-heading">Contact Information</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        Fill out the form and I will get back to you within 24 hours. Your privacy is important.
                    </p>
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="block text-xs text-muted-foreground font-bold uppercase tracking-wider">Email</span>
                                <a href="mailto:hello@example.com" className="font-semibold hover:text-primary transition-colors">hello@example.com</a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="block text-xs text-muted-foreground font-bold uppercase tracking-wider">Location</span>
                                <span className="font-semibold">Remote / Worldwide</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                <Globe className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="block text-xs text-muted-foreground font-bold uppercase tracking-wider">Availability</span>
                                <span className="font-semibold">Mon - Fri, 9am - 6pm</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border/30">
                        <div className="flex gap-4">
                            <div className="flex-1 p-6 rounded-2xl bg-secondary/30 text-center space-y-1">
                                <MessageSquare className="h-5 w-5 mx-auto text-primary mb-2" />
                                <span className="block font-bold">100%</span>
                                <span className="text-[10px] uppercase text-muted-foreground">Response Rate</span>
                            </div>
                            <div className="flex-1 p-6 rounded-2xl bg-secondary/30 text-center space-y-1">
                                <Clock className="h-5 w-5 mx-auto text-primary mb-2" />
                                <span className="block font-bold">24h</span>
                                <span className="text-[10px] uppercase text-muted-foreground">Reply Time</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-7 animate-fade-in-right" style={{ animationDelay: '0.1s' }}>
                <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    {success ? (
                        <div className="py-12 text-center space-y-8 animate-fade-in">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 mb-4">
                                <CheckCircle2 className="h-12 w-12" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-bold font-heading">Message Sent!</h3>
                                <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                                    Thank you for reaching out. I've received your message and will get back to you shortly.
                                </p>
                            </div>
                            <Button 
                                variant="outline"
                                onClick={() => setSuccess(false)}
                                className="rounded-full px-8 py-6 h-auto font-bold border-primary/20 hover:border-primary text-primary"
                            >
                                Send another message
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    id="name"
                                    label="Full Name"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your name"
                                    className="bg-background/50 border-border/50 focus:border-primary/50"
                                />
                                <Input
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your@email.com"
                                    className="bg-background/50 border-border/50 focus:border-primary/50"
                                />
                            </div>
                            
                            <Input
                                id="subject"
                                label="Subject"
                                required
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="How can I help you?"
                                className="bg-background/50 border-border/50 focus:border-primary/50"
                            />
                            
                            <Textarea
                                id="message"
                                label="Tell me about your project"
                                required
                                rows={6}
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Describe your project details, goals, and timeline..."
                                className="bg-background/50 border-border/50 focus:border-primary/50 resize-none"
                            />
                            
                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full rounded-2xl h-16 text-lg font-bold shadow-2xl shadow-primary/30 transition-all active:scale-[0.98]"
                                size="lg"
                            >
                                Send Message <Send className="ml-2 h-5 w-5" />
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
      </Container>
    </section>
  );
}

