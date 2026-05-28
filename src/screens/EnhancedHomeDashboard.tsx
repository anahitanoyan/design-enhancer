import { Bell, Calendar, CheckSquare, ShoppingCart, Users, Sparkles, Clock } from "lucide-react";
import { GlassCard } from "@/components/oikos/GlassCard";
import { AICommandBar } from "@/components/oikos/AICommandBar";
import { FamilyMembersCard } from "@/components/oikos/FamilyMembersCard";
import { AIAgentPanel } from "@/components/oikos/AIAgentPanel";
import { AISuggestionCard } from "@/components/oikos/AISuggestionCard";
import { AIInsightCard } from "@/components/oikos/AIInsightCard";
import { FloatingAIButton } from "@/components/oikos/FloatingAIButton";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { usePrefs } from "@/lib/i18n";

export function EnhancedHomeDashboard({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const { user } = useAuth();
  const { t } = usePrefs();
  const [groceryItems, setGroceryItems] = useState<Array<{ id: string; name: string; category: string; checked: boolean }>>([]);
  const [todayEvents, setTodayEvents] = useState<Array<{ id: string; title: string; time: string; attendees: string[] }>>([]);
  const [familyMembers, setFamilyMembers] = useState<Array<{ id: string; name: string; role: string; status: "active" | "away" }>>([]);
  const [unread, setUnread] = useState(0);
  const [openTasks, setOpenTasks] = useState(0);
  const [taskPreview, setTaskPreview] = useState<Array<{ id: string; title: string; priority: string }>>([]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);
  const todayLabel = useMemo(
    () => new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    []
  );
  const firstName = (user?.user_metadata?.display_name as string)?.split(" ")[0] || user?.email?.split("@")[0] || "";

  useEffect(() => {
    if (!user?.id) return;
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);

    (supabase.from("events") as any)
      .select("id, title, starts_at, attendees")
      .gte("starts_at", start.toISOString())
      .lte("starts_at", end.toISOString())
      .order("starts_at", { ascending: true })
      .limit(5)
      .then(({ data }: any) => {
        setTodayEvents((data ?? []).map((e: any) => ({
          id: e.id,
          title: e.title,
          time: new Date(e.starts_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
          attendees: Array.isArray(e.attendees) ? e.attendees : [],
        })));
      });

    (supabase.from("grocery_items") as any)
      .select("id, name, category, checked")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }: any) => setGroceryItems(data ?? []));

    (supabase.from("family_members") as any)
      .select("id, name, role, status")
      .limit(8)
      .then(({ data }: any) => setFamilyMembers((data ?? []).map((m: any) => ({
        id: m.id, name: m.name, role: m.role, status: m.status === "away" ? "away" : "active",
      }))));

    (supabase.from("notifications") as any)
      .select("id", { count: "exact", head: true })
      .eq("read", false)
      .then(({ count }: any) => setUnread(count ?? 0));

    (supabase.from("tasks") as any)
      .select("id", { count: "exact", head: true })
      .eq("completed", false)
      .then(({ count }: any) => setOpenTasks(count ?? 0));

    (supabase.from("tasks") as any)
      .select("id, title, priority")
      .eq("completed", false)
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(3)
      .then(({ data }: any) => setTaskPreview(data ?? []));
  }, [user?.id]);

  const [suggestions, setSuggestions] = useState([
    {
      id: "1",
      type: "schedule" as const,
      title: "Resolve Schedule Conflict",
      description: "Soccer practice overlaps with dentist appointment on Monday 3pm",
      action: "Auto-Resolve",
      confidence: 95
    },
    {
      id: "2",
      type: "task" as const,
      title: "Optimize Task Assignment",
      description: "I can redistribute 3 tasks based on family availability this week",
      action: "Optimize Now",
      confidence: 88
    }
  ]);

  const agentActivities = [
    {
      agent: "coordinator" as const,
      status: "working" as const,
      currentTask: "Analyzing next week's schedule..."
    },
    {
      agent: "task" as const,
      status: "completed" as const,
      lastAction: "Assigned 3 new tasks",
      actionTime: "5 min ago"
    },
    {
      agent: "reminder" as const,
      status: "idle" as const
    },
    {
      agent: "grocery" as const,
      status: "completed" as const,
      lastAction: "Added 5 items to list",
      actionTime: "1 hour ago"
    }
  ];

  const handleAICommand = (command: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("oikos_pending_ai_prompt", command);
    }
    onNavigate("ai");
  };

  const toggleGroceryItem = async (id: string) => {
    const item = groceryItems.find((i) => i.id === id);
    if (!item) return;
    setGroceryItems((items) => items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
    await (supabase.from("grocery_items") as any).update({ checked: !item.checked }).eq("id", id);
  };

  const handleAcceptSuggestion = (id: string) => {
    setSuggestions(suggestions.filter(s => s.id !== id));
    console.log("Accepted suggestion:", id);
  };

  const handleDismissSuggestion = (id: string) => {
    setSuggestions(suggestions.filter(s => s.id !== id));
  };

  const handleFloatingAction = (action: string) => {
    if (action === "chat") {
      onNavigate("ai");
    } else if (action === "plan") {
      onNavigate("schedule");
    } else if (action === "tasks") {
      onNavigate("tasks");
    } else if (action === "grocery") {
      onNavigate("grocery");
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Hero header with gradient */}
      <div className="relative overflow-hidden px-4 pt-6 pb-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
        <div className="max-w-md mx-auto">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{todayLabel}</p>
              <h1 className="text-3xl font-semibold leading-tight">
                {greeting}
                {firstName ? <span className="text-primary">, {firstName}</span> : ""}
              </h1>
            </div>
            <button
              onClick={() => onNavigate('notifications')}
              className="relative h-10 w-10 rounded-full bg-card/60 backdrop-blur flex items-center justify-center border border-border/40"
              aria-label={t("notifications")}
            >
              <Bell className="w-5 h-5 text-foreground" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-alert rounded-full text-[10px] text-white flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
          </div>

          {/* Live stat tiles */}
          <div className="grid grid-cols-4 gap-2 mb-5">
            {[
              { icon: Calendar, label: "Today", value: todayEvents.length, tone: "from-primary/30 to-primary/5" },
              { icon: CheckSquare, label: "Open", value: openTasks, tone: "from-accent/30 to-accent/5" },
              { icon: ShoppingCart, label: "Cart", value: groceryItems.filter(g => !g.checked).length, tone: "from-success/30 to-success/5" },
              { icon: Users, label: "Family", value: familyMembers.length, tone: "from-warning/30 to-warning/5" },
            ].map(({ icon: Icon, label, value, tone }) => (
              <button
                key={label}
                className={`rounded-2xl p-3 bg-gradient-to-br ${tone} border border-border/40 backdrop-blur flex flex-col items-start gap-1 transition hover:scale-[1.02]`}
              >
                <Icon className="w-4 h-4 text-foreground/70" />
                <span className="text-xl font-semibold leading-none">{value}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
              </button>
            ))}
          </div>

          {/* AI Command Bar */}
          <AICommandBar onSubmit={handleAICommand} placeholder="Ask Oikos to plan, schedule, or organize…" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Bento grid — denser, side-by-side cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Today's Schedule — spans full width */}
          <GlassCard className="col-span-2 p-4">
            <button onClick={() => onNavigate('schedule')} className="w-full text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium">Today's Schedule</h3>
                </div>
                <span className="text-xs text-muted-foreground">{todayEvents.length} events</span>
              </div>
              {todayEvents.length === 0 ? (
                <p className="text-xs text-muted-foreground py-3">No events today — tap to plan your day.</p>
              ) : (
                <div className="space-y-2">
                  {todayEvents.slice(0, 3).map((e) => (
                    <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg bg-card/40">
                      <div className="w-1 h-8 bg-primary rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{e.title}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />{e.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </button>
          </GlassCard>

          {/* Tasks */}
          <GlassCard className="p-4">
            <button onClick={() => onNavigate('tasks')} className="w-full text-left h-full flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <CheckSquare className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-medium">Tasks</h3>
              </div>
              <p className="text-2xl font-semibold mb-2">{openTasks}</p>
              <div className="space-y-1 flex-1">
                {taskPreview.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground">All done 🎉</p>
                ) : taskPreview.map((t) => (
                  <div key={t.id} className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      t.priority === 'high' ? 'bg-alert' : t.priority === 'medium' ? 'bg-warning' : 'bg-success'
                    }`} />
                    <span className="text-[11px] truncate">{t.title}</span>
                  </div>
                ))}
              </div>
            </button>
          </GlassCard>

          {/* Grocery */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-success" />
                <h3 className="text-sm font-medium">Grocery</h3>
              </div>
              <button onClick={() => onNavigate('grocery')} className="text-[10px] text-primary">View</button>
            </div>
            <p className="text-2xl font-semibold mb-2">{groceryItems.filter(g => !g.checked).length}</p>
            <div className="space-y-1.5">
              {groceryItems.slice(0, 3).map((g) => (
                <label key={g.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={g.checked} onCheckedChange={() => toggleGroceryItem(g.id)} />
                  <span className={`text-[11px] truncate ${g.checked ? 'line-through text-muted-foreground' : ''}`}>
                    {g.name}
                  </span>
                </label>
              ))}
              {groceryItems.length === 0 && <p className="text-[10px] text-muted-foreground">List empty</p>}
            </div>
          </GlassCard>

          {/* AI Insights — full width */}
          <div className="col-span-2">
            <AIInsightCard
              insight={{
                type: "analysis",
                title: "Weekly Analysis",
                description: "Your household has been optimized this week.",
                metrics: [
                  { label: "Conflicts", value: "2", status: "warning" },
                  { label: "Optimized", value: "5", status: "success" },
                  { label: "Saved", value: "3h", status: "info" }
                ],
                actions: [{ label: "View Details", onClick: () => onNavigate("ai") }]
              }}
            />
          </div>

          {/* Family — full width */}
          <div className="col-span-2">
            <FamilyMembersCard members={familyMembers} />
          </div>

          {/* AI Agents */}
          <GlassCard className="col-span-2 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-medium">AI Agents Active</h3>
            </div>
            <AIAgentPanel activities={agentActivities} compact />
          </GlassCard>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="col-span-2 space-y-3">
              {suggestions.map((s) => (
                <AISuggestionCard
                  key={s.id}
                  suggestion={s}
                  onAccept={handleAcceptSuggestion}
                  onDismiss={handleDismissSuggestion}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating AI Assistant */}
      <FloatingAIButton onAction={handleFloatingAction} />
    </div>
  );
}
