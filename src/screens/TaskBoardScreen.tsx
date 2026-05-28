import { ArrowLeft, Plus, CheckSquare, Loader2, Edit, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { GlassCard } from "@/components/oikos/GlassCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Check } from "lucide-react";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "inProgress" | "done";
  priority: "low" | "medium" | "high";
  category: string | null;
  assignee: string | null;
  due_date: string | null;
  completed: boolean;
};

const PRIORITY_STYLE: Record<string, string> = {
  low: "bg-success/20 text-success",
  medium: "bg-warning/20 text-warning",
  high: "bg-alert/20 text-alert",
};

export function TaskBoardScreen({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [saving, setSaving] = useState(false);

  // form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task["status"]>("todo");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [category, setCategory] = useState("Home");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await (supabase.from("tasks") as any)
      .select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) toast.error(error.message);
    else setTasks((data ?? []) as Task[]);
  };
  useEffect(() => { load(); }, [user?.id]);

  const openAdd = () => {
    setEditing(null);
    setTitle(""); setDescription(""); setStatus("todo");
    setPriority("medium"); setCategory("Home"); setAssignee(""); setDueDate("");
    setDialogOpen(true);
  };
  const openEdit = (t: Task) => {
    setEditing(t);
    setTitle(t.title); setDescription(t.description ?? "");
    setStatus(t.status); setPriority(t.priority);
    setCategory(t.category ?? "Home"); setAssignee(t.assignee ?? "");
    setDueDate(t.due_date ?? "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const payload = {
      owner_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      status, priority,
      category: category || null,
      assignee: assignee.trim() || null,
      due_date: dueDate || null,
      completed: status === "done",
    };
    const { error } = editing
      ? await (supabase.from("tasks") as any).update(payload).eq("id", editing.id)
      : await (supabase.from("tasks") as any).insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editing ? "Task updated" : "Task created");
    setDialogOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await (supabase.from("tasks") as any).delete().eq("id", deleteTarget.id);
    if (error) toast.error(error.message);
    else { toast.success("Task deleted"); load(); }
    setDeleteTarget(null);
  };

  const toggleComplete = async (t: Task) => {
    const newStatus = t.completed ? "todo" : "done";
    const { error } = await (supabase.from("tasks") as any)
      .update({ completed: !t.completed, status: newStatus }).eq("id", t.id);
    if (error) toast.error(error.message);
    else { toast.success(t.completed ? "Marked open" : "Task completed"); load(); }
  };

  const grouped = {
    todo: tasks.filter(t => t.status === "todo"),
    inProgress: tasks.filter(t => t.status === "inProgress"),
    done: tasks.filter(t => t.status === "done"),
  };

  const renderTask = (t: Task) => (
    <GlassCard key={t.id} className={`p-4 ${t.completed ? "opacity-70" : ""}`}>
      <div className="flex items-start justify-between mb-2 gap-2">
        <button onClick={() => toggleComplete(t)} className="mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center hover:bg-primary/10">
          {t.completed && <Check className="w-3 h-3 text-primary" />}
        </button>
        <h4 className={`flex-1 ${t.completed ? "line-through text-muted-foreground" : ""}`}>{t.title}</h4>
      </div>
      {t.description && <p className="text-xs text-muted-foreground mb-2">{t.description}</p>}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_STYLE[t.priority]}`}>{t.priority}</span>
        {t.category && <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{t.category}</span>}
        {t.assignee && (
          <div className="flex items-center gap-1">
            <Avatar className="w-5 h-5"><AvatarFallback className="text-[10px] bg-primary text-primary-foreground">{t.assignee.split(" ").map(n=>n[0]).join("").slice(0,2)}</AvatarFallback></Avatar>
            <span className="text-xs text-muted-foreground">{t.assignee}</span>
          </div>
        )}
        {t.due_date && <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto"><Clock className="w-3 h-3" />{t.due_date}</div>}
      </div>
      <div className="flex gap-2">
        <button onClick={() => openEdit(t)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/40 hover:bg-white/60 text-xs"><Edit className="w-3 h-3" />Edit</button>
        <button onClick={() => setDeleteTarget(t)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-alert/20 hover:bg-alert/30 text-alert text-xs"><Trash2 className="w-3 h-3" />Delete</button>
      </div>
    </GlassCard>
  );

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} aria-label="Back"><ArrowLeft className="w-6 h-6" /></button>
        <CheckSquare className="w-6 h-6 text-primary" />
        <h2>Tasks</h2>
        <button onClick={openAdd} aria-label="Add task" className="ml-auto p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 pb-24">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <Tabs defaultValue="todo" className="w-full">
            <TabsList className="glass-card w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="todo">To Do ({grouped.todo.length})</TabsTrigger>
              <TabsTrigger value="inProgress">Doing ({grouped.inProgress.length})</TabsTrigger>
              <TabsTrigger value="done">Done ({grouped.done.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="todo" className="space-y-3">
              {grouped.todo.length === 0 ? <p className="text-center text-sm text-muted-foreground py-6">No tasks yet — tap + to add one.</p> : grouped.todo.map(renderTask)}
            </TabsContent>
            <TabsContent value="inProgress" className="space-y-3">
              {grouped.inProgress.length === 0 ? <p className="text-center text-sm text-muted-foreground py-6">Nothing in progress.</p> : grouped.inProgress.map(renderTask)}
            </TabsContent>
            <TabsContent value="done" className="space-y-3">
              {grouped.done.length === 0 ? <p className="text-center text-sm text-muted-foreground py-6">No completed tasks.</p> : grouped.done.map(renderTask)}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit task" : "New task"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label htmlFor="t-title">Title</Label><Input id="t-title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Pick up groceries" /></div>
            <div className="space-y-1.5"><Label htmlFor="t-desc">Description</Label><Textarea id="t-desc" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Optional notes" rows={2} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Status</Label>
                <Select value={status} onValueChange={(v)=>setStatus(v as Task["status"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select></div>
              <div className="space-y-1.5"><Label>Priority</Label>
                <Select value={priority} onValueChange={(v)=>setPriority(v as Task["priority"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label htmlFor="t-cat">Category</Label><Input id="t-cat" value={category} onChange={e=>setCategory(e.target.value)} placeholder="Home" /></div>
              <div className="space-y-1.5"><Label htmlFor="t-assignee">Assignee</Label><Input id="t-assignee" value={assignee} onChange={e=>setAssignee(e.target.value)} placeholder="Jane Doe" /></div>
            </div>
            <div className="space-y-1.5"><Label htmlFor="t-due">Due date</Label><Input id="t-due" type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-[#FF7E9D] to-[#7AB8E0] text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o)=>!o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>"{deleteTarget?.title}" will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-alert text-white hover:bg-alert/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
