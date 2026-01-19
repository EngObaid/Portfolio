import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../../api/projects";
import type { Project, Message } from "../../types";
import { 
    Plus, 
    Pencil, 
    Trash2, 
    Loader2,
    FolderKanban,
    MessageSquare,
    Star,
    ArrowUpRight,
    Search,
    Filter
} from "lucide-react";
import { http } from "../../api/http";
import { getImageUrl, cn } from "../../lib/utils";
import { Button, Badge } from "../../components/ui";
import { useToast } from "../../context/ToastContext";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
        const [projectsRes, messagesRes] = await Promise.all([
            getProjects(),
            http.get<Message[]>("/api/messages")
        ]);
        setProjects(projectsRes);
        setMessages(messagesRes as unknown as Message[]);
    } catch (error) {
        console.error(error);
        showToast("Failed to fetch dashboard data", "error");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
        await http.delete(`/api/projects/${id}`);
        setProjects(projects.filter(p => p._id !== id));
        showToast("Project deleted", "success");
    } catch (error) {
        console.error("Failed to delete project", error);
        showToast("Failed to delete project", "error");
    }
  };

  if (loading) {
    return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  const stats = [
    { label: "Total Projects", value: projects.length, icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Featured Projects", value: projects.filter(p => p.featured).length, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Inquiries", value: messages.length, icon: MessageSquare, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
            <h1 className="text-4xl font-bold font-heading tracking-tight">Overview</h1>
            <p className="text-muted-foreground font-medium">Your portfolio at a glance</p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-2xl h-12 px-6">
                <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button className="rounded-2xl h-12 shadow-xl shadow-primary/20 px-6" asChild>
                <Link to="/admin/projects/new">
                    <Plus className="mr-2 h-5 w-5" /> Create Project
                </Link>
            </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-slate-900/50 p-8 rounded-[32px] border border-border/50 shadow-sm flex items-center gap-6 group hover:border-primary/30 transition-all">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                    <stat.icon className={cn("h-8 w-8", stat.color)} />
                </div>
                <div>
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                    <span className="block text-3xl font-bold mt-1 tracking-tight">{stat.value}</span>
                </div>
            </div>
        ))}
      </div>

      {/* Projects Table Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold font-heading">Recent Projects</h2>
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search projects..." 
                    className="bg-secondary/40 border border-transparent focus:border-primary/20 focus:bg-background h-10 pl-10 pr-4 rounded-xl text-sm w-64 transition-all outline-none"
                />
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 rounded-[40px] border border-border/50 shadow-xl overflow-hidden backdrop-blur-sm">
            <div className="relative w-full overflow-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b border-border/30 bg-secondary/20">
                            <th className="h-14 px-8 align-middle font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Preview</th>
                            <th className="h-14 px-8 align-middle font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Project Details</th>
                            <th className="h-14 px-8 align-middle font-bold text-muted-foreground uppercase tracking-widest text-[10px] hidden md:table-cell">Metrics</th>
                            <th className="h-14 px-8 align-middle font-bold text-muted-foreground uppercase tracking-widest text-[10px] text-right">Options</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {projects.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                                            <FolderKanban className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-lg font-bold">No projects yet</p>
                                            <p className="text-muted-foreground font-light px-10">Start by adding your first masterpiece to the portfolio.</p>
                                        </div>
                                        <Button className="rounded-full mt-4" asChild>
                                            <Link to="/admin/projects/new"><Plus className="mr-2 h-4 w-4" /> Add New</Link>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            projects.map((project) => (
                                <tr key={project._id} className="group hover:bg-secondary/20 transition-colors">
                                    <td className="p-8 align-middle">
                                        <div className="relative w-24 h-16 rounded-xl overflow-hidden shadow-lg border border-border/50 group-hover:scale-105 transition-transform duration-500">
                                            {project.coverImage ? (
                                                <img 
                                                    src={getImageUrl(project.coverImage)} 
                                                    alt={project.title} 
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground">N/A</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-8 align-middle">
                                        <div className="space-y-1">
                                            <span className="block font-bold text-lg group-hover:text-primary transition-colors">{project.title}</span>
                                            <div className="flex flex-wrap gap-2">
                                                {project.featured && (
                                                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-lg text-[10px] font-black uppercase">Featured</Badge>
                                                )}
                                                {project.tags.slice(0, 2).map(tag => (
                                                    <Badge key={tag} variant="secondary" className="rounded-lg text-[10px] lowercase px-2 font-medium">{tag}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 align-middle hidden md:table-cell">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-muted-foreground text-xs uppercase font-bold tracking-tighter">Tech Components</span>
                                            <span className="font-medium text-xs">{project.techStack.length} tools utilized</span>
                                        </div>
                                    </td>
                                    <td className="p-8 align-middle text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all scale-90 group-hover:scale-100" asChild>
                                                <Link to={`/projects/${project.slug}`} target="_blank" title="View Public Page">
                                                    <ArrowUpRight className="h-5 w-5" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-500/10 hover:text-blue-500 transition-all scale-90 group-hover:scale-100" asChild>
                                                <Link to={`/admin/projects/${project.slug}`} title="Edit Project">
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleDelete(project._id)}
                                                className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all scale-90 group-hover:scale-100"
                                                title="Delete Forever"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}

