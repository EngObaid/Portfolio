import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Lock, Mail, ArrowLeft, Sparkles } from "lucide-react";
import { Input, Button, Badge } from "../../components/ui";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="flex flex-col items-center">
            <Link to="/" className="group mb-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium">
                <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                Back to site
            </Link>

            <div className="w-full rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                {/* Decorative border glow */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                
                <div className="flex flex-col items-center text-center space-y-6 mb-10">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-2xl shadow-primary/40 group relative overflow-hidden">
                        <LayoutDashboard className="h-10 w-10 relative z-10" />
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </div>
                   
                    <div className="space-y-2">
                        <Badge variant="outline" className="rounded-full px-4 py-1 border-primary/20 text-primary font-bold flex items-center gap-2 mx-auto w-fit">
                            <Sparkles className="h-3 w-3" />
                            Premium Admin
                        </Badge>
                        <h1 className="text-3xl font-heading font-black tracking-tighter">Welcome Back</h1>
                        <p className="text-muted-foreground font-light px-4">
                            System authentication required for administrative access.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-destructive/10 text-destructive text-xs font-bold p-4 rounded-2xl border border-destructive/20 text-center mb-8 animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email Address"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:bg-white/10 focus:border-primary/50 transition-all font-medium"
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:bg-white/10 focus:border-primary/50 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        isLoading={loading}
                        className="w-full h-16 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all"
                    >
                        Sign In to Console
                    </Button>
                </form>
            </div>
            
            <p className="mt-8 text-center text-sm text-muted-foreground/60 font-medium tracking-tight uppercase">
                &copy; {new Date().getFullYear()} Premium Dashboard &bull; All Rights Reserved
            </p>
        </div>
      </div>
    </div>
  );
}
