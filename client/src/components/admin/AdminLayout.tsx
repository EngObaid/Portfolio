import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
    LayoutDashboard, 
    FolderPlus, 
    MessageSquare, 
    LogOut,
    Menu,
    X,
    FolderKanban,
    ChevronRight,
    Search,
    Bell,
    User,
    FileText,
    FilePlus
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "../../lib/utils";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui";

export function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/projects", icon: FolderKanban, label: "Projects" },
    { href: "/admin/projects/new", icon: FolderPlus, label: "New Project" },
    { href: "/admin/blog", icon: FileText, label: "Blog Posts" },
    { href: "/admin/blog/new", icon: FilePlus, label: "New Blog Post" },
    { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
  ];

  const breadcrumbs = useMemo(() => {
    const paths = location.pathname.split('/').filter(p => p !== '');
    return paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const label = path === 'admin' ? 'Dashboard' : path.charAt(0).toUpperCase() + path.slice(1);
        return { label, href, isLast: index === paths.length - 1 };
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-[60] backdrop-blur-md bg-background/80">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                <LayoutDashboard className="h-5 w-5" />
            </div>
            <span className="font-bold tracking-tight">Admin Console</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-border/50 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col shadow-2xl md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-8 border-b border-border/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
                <span className="block font-bold text-lg leading-none">Portfolio</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Admin Pro</span>
            </div>
        </div>
        
        <div className="flex-1 py-8 px-4 space-y-1 overflow-y-auto">
            <div className="px-4 mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">Main Menu</span>
            </div>
            {navItems.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== "/admin" && location.pathname.startsWith(item.href));
                return (
                    <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            "group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200",
                            isActive
                             ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                             : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                        )}
                    >
                        <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                        {item.label}
                        {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
                    </Link>
                );
            })}
        </div>

        <div className="p-6 border-t border-border/50 space-y-6">
            <div className="flex items-center gap-4 px-2">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border overflow-hidden">
                        <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                    <span className="block text-sm font-bold truncate">Administrator</span>
                    <span className="block text-[10px] text-muted-foreground truncate">{user?.email}</span>
                </div>
            </div>
            
            <div className="flex gap-2">
                <ThemeToggle className="flex-1 h-12 bg-secondary/50 rounded-xl hover:bg-secondary" />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleLogout}
                    className="h-12 w-12 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
                    title="Sign Out"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen">
        {/* Desktop Header / Toolbar */}
        <header className="hidden md:flex items-center justify-between h-20 px-8 border-b border-border/50 bg-background/50 backdrop-blur-xl sticky top-0 z-40">
           <nav className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, idx) => (
                    <div key={crumb.href} className="flex items-center gap-2">
                        {idx > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground/40" />}
                        <Link 
                            to={crumb.href} 
                            className={cn(
                                "font-medium transition-colors hover:text-primary",
                                crumb.isLast ? "text-foreground font-bold" : "text-muted-foreground"
                            )}
                        >
                            {crumb.label}
                        </Link>
                    </div>
                ))}
           </nav>

           <div className="flex items-center gap-4">
                <div className="relative group hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search resources..." 
                        className="bg-secondary/40 border border-transparent focus:border-primary/20 focus:bg-background h-10 pl-10 pr-4 rounded-xl text-sm w-64 transition-all outline-none"
                    />
                </div>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl overflow-hidden group">
                    <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                </Button>
           </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10">
            <div className="max-w-7xl mx-auto animate-fade-in-up">
                <Outlet />
            </div>
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

