import { ArrowLeft, Plus, CheckSquare, Search, Trash2 } from "lucide-react";
import { TaskCard } from "@/components/oikos/TaskCard";
import { GlassCard } from "@/components/oikos/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Priority = "low" | "medium" | "high";
type Status = "todo" | "in_progress" | "done";
type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: Status;
  category: string | null;
  assignee: string | null;
  due_date: string | null;
  completed: boolean;
};

function fmtDate(d: string | null) {
  if (!d) return "No date";
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function DetailedTaskScreen({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | Priority>("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    category: "Home",
    assignee: "",
    due_date: "",
  });

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("id,title,description,priority,status,category,assignee,due_date,completed")
      .order("due_date", { ascending: true, nullsFirst: false });
    if (error) toast.error(error.message);
    setTasks((data as Task[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.id]);

  const createTask = async () => {
    if (!user || !form.title.trim()) return;
    const { error } = await supabase.from("tasks").insert({
      owner_id: user.id,
      title: form.title.trim(),
      description: form.description.trim() || null,
      priority: form.priority,
      status: "todo",
      category: form.category || null,
      assignee: form.assignee.trim() || null,
      due_date: form.due_date || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Task created");
    setForm({ title: "", description: "", priority: "medium", category: "Home", assignee: "", due_date: "" });
    setOpen(false);
    load();
  };

  const cycleStatus = async (t: Task) => {
    const next: Status = t.status === "todo" ? "in_progress" : t.status === "in_progress" ? "done" : "todo";
    const { error } = await supabase
      .from("tasks")
      .update({ status: next, completed: next === "done" })
      .eq("id", t.id);
    if (error) return toast.error(error.message);
    load();
  };

  const removeTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Task deleted");
    load();
  };

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filterBy !== "all" && t.priority !== filterBy) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!t.title.toLowerCase().includes(q) && !(t.category ?? "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [tasks, filterBy, searchQuery]);

  const grouped = useMemo(() => ({
    todo: filtered.filter((t) => t.status === "todo"),
    inProgress: filtered.filter((t) => t.status === "in_progress"),
    done: filtered.filter((t) => t.status === "done" || t.completed),
  }), [filtered]);

  const taskStats = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "done" || t.completed).length,
      overdue: tasks.filter((t) => t.due_date && !t.completed && new Date(t.due_date) < today).length,
      highPriority: tasks.filter((t) => t.priority === "high" && !t.completed).length,
    };
  }, [tasks]);

  const renderList = (list: Task[], empty: string) =>
    list.length === 0 ? (
      <GlassCard className="p-8 text-center">
        <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-sm text-muted-foreground">{empty}</p>
      </GlassCard>
    ) : (
      list.map((task) => (
        <div key={task.id} className="relative group">
          <TaskCard
            title={task.title}
            assignee={{ name: task.assignee || "Unassigned" }}
            dueDate={fmtDate(task.due_date)}
            priority={task.priority}
            category={task.category || "General"}
            completed={task.status === "done" || task.completed}
            onClick={() => cycleStatus(task)}
          />
          <button
            onClick={() => removeTask(task.id)}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-alert/10 text-alert opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF5F0] via-[#E8F4F8] to-[#F0F8FF]">
      {/* Header */}
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <CheckSquare className="w-6 h-6 text-primary" />
        <h2>Tasks</h2>
        <button onClick={() => setOpen(true)} className="ml-auto p-2 rounded-full bg-primary text-primary-foreground">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24 space-y-4">
        {/* Task Statistics */}
        <GlassCard className="p-4">
          <h3 className="mb-4">Overview</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/30">
              <div className="text-2xl font-semibold text-primary mb-1">{taskStats.total}</div>
              <div className="text-xs text-muted-foreground">Total Tasks</div>
            </div>
            <div className="p-3 rounded-xl bg-white/30">
              <div className="text-2xl font-semibold text-success mb-1">{taskStats.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="p-3 rounded-xl bg-white/30">
              <div className="text-2xl font-semibold text-alert mb-1">{taskStats.overdue}</div>
              <div className="text-xs text-muted-foreground">Overdue</div>
            </div>
            <div className="p-3 rounded-xl bg-white/30">
              <div className="text-2xl font-semibold text-warning mb-1">{taskStats.highPriority}</div>
              <div className="text-xs text-muted-foreground">High Priority</div>
            </div>
          </div>
        </GlassCard>

        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="glass-card p-3 flex items-center gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterBy("all")}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                filterBy === "all"
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-card'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterBy("high")}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                filterBy === "high"
                  ? 'bg-alert text-white'
                  : 'glass-card'
              }`}
            >
              High Priority
            </button>
            <button
              onClick={() => setFilterBy("medium")}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                filterBy === "medium"
                  ? 'bg-warning text-white'
                  : 'glass-card'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setFilterBy("low")}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                filterBy === "low"
                  ? 'bg-success text-white'
                  : 'glass-card'
              }`}
            >
              Low Priority
            </button>
          </div>
        </div>

        {/* Task Lists */}
        <Tabs defaultValue="todo" className="w-full">
          <TabsList className="glass-card w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="todo">
              To Do <span className="ml-1 text-xs">({grouped.todo.length})</span>
            </TabsTrigger>
            <TabsTrigger value="inProgress">
              In Progress <span className="ml-1 text-xs">({grouped.inProgress.length})</span>
            </TabsTrigger>
            <TabsTrigger value="done">
              Done <span className="ml-1 text-xs">({grouped.done.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todo" className="space-y-3">
            {loading ? <p className="text-sm text-muted-foreground text-center py-4">Loading…</p> : renderList(grouped.todo, "No tasks found")}
          </TabsContent>

          <TabsContent value="inProgress" className="space-y-3">
            {renderList(grouped.inProgress, "No tasks in progress")}
          </TabsContent>

          <TabsContent value="done" className="space-y-3">
            {renderList(grouped.done, "No completed tasks")}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Task</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional notes" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Priority })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div>
                <Label>Assignee</Label>
                <Input value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} placeholder="Name" />
              </div>
              <div>
                <Label>Due date</Label>
                <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={createTask} disabled={!form.title.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
