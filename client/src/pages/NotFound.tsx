import { Link } from "react-router-dom";
import { MoveLeft, Ghost } from "lucide-react";
import { Button } from '../components/ui';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      
      <div className="space-y-6 animate-fade-in-up">
        <div className="relative inline-block">
            <Ghost className="h-24 w-24 text-primary/20 animate-bounce-slow" />
            <h1 className="absolute inset-0 flex items-center justify-center text-8xl font-black text-foreground opacity-10 select-none">404</h1>
        </div>
        
        <div className="space-y-2">
            <h2 className="text-4xl font-heading font-black tracking-tighter">Lost in Space?</h2>
            <p className="text-muted-foreground max-w-md mx-auto font-light text-lg">
                The page you're looking for seems to have drifted into another dimension. Let's get you back on track.
            </p>
        </div>

        <div className="pt-4">
            <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20 hover:scale-105 transition-all" asChild>
                <Link to="/">
                    <MoveLeft className="mr-2 h-5 w-5" /> Back to Safety
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
