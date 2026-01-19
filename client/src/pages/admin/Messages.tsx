import { useEffect, useState, useMemo } from "react";
import { http } from "../../api/http";
import type { Message } from "../../types";
import { Loader2, Trash2, Mail, Calendar, User, MessageSquare, Reply, Search, CheckCircle, Circle } from "lucide-react";
import { format } from "date-fns";
import { Button, Badge, Input } from "../../components/ui";
import { useToast } from "../../context/ToastContext";
import { cn } from "../../lib/utils";

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const { showToast } = useToast();

  useEffect(() => {
    http.get<Message[]>("/api/messages")
      .then(res => setMessages(res as unknown as Message[]))
      .catch((err) => {
          console.error(err);
          // Standardized response handled by http interceptor for toast
      })
      .finally(() => setLoading(false));
  }, []); // Toast handled by interceptor

  const filteredMessages = useMemo(() => {
    return messages?.filter((msg) => {
      const matchesSearch = 
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeTab === "unread") return matchesSearch && !msg.read;
      if (activeTab === "read") return matchesSearch && msg.read;
      return matchesSearch;
    });
  }, [messages, searchQuery, activeTab]);

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    try {
        await http.patch(`/api/messages/${id}`, { read: !currentStatus });
        setMessages(messages.map(m => m._id === id ? { ...m, read: !currentStatus } : m));
        showToast(`Message marked as ${!currentStatus ? 'read' : 'unread'}`, "success");
    } catch (error) {
        console.error("Failed to update message status", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
        await http.delete(`/api/messages/${id}`);
        setMessages(messages?.filter(m => m._id !== id));
        showToast("Message deleted", "success");
        if (selectedId === id) setSelectedId(null);
    } catch (error) {
        console.error("Failed to delete message", error);
    }
  };

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight font-heading">Communication Center</h1>
              <p className="text-muted-foreground text-sm font-medium">Manage incoming inquiries and collaborations</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                    placeholder="Search messages..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-2xl bg-white dark:bg-slate-900 border-border/50 focus:border-primary/50 h-10"
                />
            </div>
          </div>
      </div>

      <div className="flex items-center gap-2 p-1 bg-secondary/20 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab("all")}
            className={cn(
                "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                activeTab === "all" ? "bg-white dark:bg-slate-800 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab("unread")}
            className={cn(
                "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                activeTab === "unread" ? "bg-white dark:bg-slate-800 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Unread
            {messages?.filter(m => !m.read).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("read")}
            className={cn(
                "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                activeTab === "read" ? "bg-white dark:bg-slate-800 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Read
          </button>
      </div>
      
      {filteredMessages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900/50 rounded-[40px] border border-dashed border-border/50 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <Mail className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-bold">No messages found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto font-light">
                    {searchQuery ? "Try adjusting your search terms." : "Your inbox is clear for this category."}
                </p>
            </div>
          </div>
      ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Message List */}
            <div className="lg:col-span-4 space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-3">
                    {filteredMessages.map((msg) => (
                        <div 
                            key={msg._id} 
                            onClick={() => msg._id && setSelectedId(msg._id)}
                            className={cn(
                                "group cursor-pointer p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden",
                                selectedId === msg._id 
                                    ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 scale-[1.02] z-10" 
                                    : "bg-white dark:bg-slate-900/50 border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 shadow-sm",
                                !msg.read && selectedId !== msg._id && "border-l-4 border-l-primary"
                            )}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest",
                                    selectedId === msg._id ? "text-primary-foreground/70" : "text-primary"
                                )}>
                                    {msg.createdAt && format(new Date(msg.createdAt), "MMM d")}
                                </span>
                                {!msg.read && (
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        selectedId === msg._id ? "bg-white" : "bg-primary"
                                    )} />
                                )}
                            </div>
                            <h3 className={cn(
                                "font-bold truncate pr-4 mb-1",
                                !msg.read && selectedId !== msg._id ? "text-foreground" : ""
                            )}>{msg.subject}</h3>
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-xs truncate",
                                    selectedId === msg._id ? "text-primary-foreground/80" : "text-muted-foreground",
                                    !msg.read && selectedId !== msg._id && "font-bold text-foreground"
                                )}>
                                    {msg.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Message Detail View */}
            <div className="lg:col-span-8 h-full">
                {selectedId ? (
                    <div className="bg-white dark:bg-slate-900 border border-border/50 rounded-[40px] shadow-2xl overflow-hidden animate-fade-in flex flex-col">
                        {messages?.filter(m => m._id === selectedId).map(msg => (
                            <div key={msg._id} className="flex flex-col h-full">
                                {/* Detail Header */}
                                <div className="p-8 border-b border-border/50 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                                                <User className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold font-heading">{msg.name}</h2>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Mail className="h-3 w-3" />
                                                    {msg.email}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="icon" 
                                                className="rounded-xl border-border/50 hover:bg-secondary"
                                                onClick={() => msg._id && handleToggleRead(msg._id, msg.read)}
                                                title={msg.read ? "Mark as unread" : "Mark as read"}
                                            >
                                                {msg.read ? <Circle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="icon" 
                                                onClick={() => msg._id && handleDelete(msg._id)}
                                                className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-border/30">
                                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Subject</div>
                                        <div className="font-bold text-lg">{msg.subject}</div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1 min-h-[300px]">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 mb-6">
                                            <Badge variant="outline" className="rounded-lg px-2 text-[10px] font-bold py-1 flex items-center gap-2 border-border/50">
                                                <Calendar className="h-3 w-3" />
                                                {msg.createdAt && format(new Date(msg.createdAt), "PPPP")}
                                            </Badge>
                                            <Badge variant="outline" className="rounded-lg px-2 text-[10px] font-bold py-1 flex items-center gap-2 border-border/50">
                                                <MessageSquare className="h-3 w-3" />
                                                Direct Inquiry
                                            </Badge>
                                        </div>
                                        <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-light whitespace-pre-wrap">
                                            {msg.message}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div className="p-8 border-t border-border/50 bg-slate-50/50 dark:bg-slate-800/10 flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground italic">
                                        Reply via email to continue the conversation.
                                    </p>
                                    <Button asChild className="rounded-full px-8 shadow-lg shadow-primary/20">
                                        <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}>
                                            Reply Now <Reply className="ml-2 h-4 w-4" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/30 rounded-[40px] border border-dashed border-border/50 text-center space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg">
                            <MessageSquare className="h-8 w-8 text-primary shadow-sm" />
                        </div>
                        <p className="text-muted-foreground font-medium">Select a message to view details</p>
                    </div>
                )}
            </div>
          </div>
      )}
    </div>
  );
}

