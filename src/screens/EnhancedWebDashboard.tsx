import { Calendar, CheckSquare, ShoppingCart, Bell } from "lucide-react";
import { GlassCard } from "@/components/oikos/GlassCard";
import { AICommandBar } from "@/components/oikos/AICommandBar";
import { TaskCard } from "@/components/oikos/TaskCard";
import { NotificationCard } from "@/components/oikos/NotificationCard";
import { FamilyMembersCard } from "@/components/oikos/FamilyMembersCard";
import { AIAgentPanel } from "@/components/oikos/AIAgentPanel";
import { AISuggestionCard } from "@/components/oikos/AISuggestionCard";
import { AIInsightCard } from "@/components/oikos/AIInsightCard";
import { ConflictResolutionCard } from "@/components/oikos/ConflictResolutionCard";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export function EnhancedWebDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleAICommand = (cmd: string) => {
    if (typeof window !== "undefined") sessionStorage.setItem("oikos_pending_ai_prompt", cmd);
    navigate({ to: "/ai" });
  };
  const [groceryItems, setGroceryItems] = useState<Array<{ id: string; name: string; category: string; checked: boolean }>>([]);
  const [tasks, setTasks] = useState<Array<{ id: string; title: string; assignee: { name: string }; dueDate: string; priority: "low" | "medium" | "high"; category: string }>>([]);
  const [familyMembers, setFamilyMembers] = useState<Array<{ id: string; name: string; role: string; status: "active" | "away" }>>([]);
  const [weekEvents, setWeekEvents] = useState<Array<{ day: number; time: string; title: string; attendee: string; color: string }>>([]);
  const [alerts, setAlerts] = useState<Array<{ id: string; title: string; message: string; type: "alert" | "success" | "info"; time: string; urgent: boolean }>>([]);

  const firstName = (user?.user_metadata?.display_name as string)?.split(" ")[0] || user?.email?.split("@")[0] || "there";
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  }, []);
  const todayLabel = useMemo(
    () => new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    []
  );

  const { weekDays, weekDates, todayIdx } = useMemo(() => {
    const today = new Date();
    const dow = (today.getDay() + 6) % 7; // Mon=0..Sun=6
    const monday = new Date(today);
    monday.setDate(today.getDate() - dow);
    monday.setHours(0, 0, 0, 0);
    const labels: string[] = []; const dates: number[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday); d.setDate(monday.getDate() + i);
      labels.push(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]);
      dates.push(d.getDate());
    }
    return { weekDays: labels, weekDates: dates, todayIdx: dow, monday };
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const today = new Date();
    const dow = (today.getDay() + 6) % 7;
    const monday = new Date(today); monday.setDate(today.getDate() - dow); monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday); sunday.setDate(monday.getDate() + 7);

    (supabase.from("events") as any)
      .select("id, title, starts_at, attendees")
      .gte("starts_at", monday.toISOString())
      .lt("starts_at", sunday.toISOString())
      .order("starts_at", { ascending: true })
      .then(({ data }: any) => {
        const colors = ["bg-primary", "bg-secondary", "bg-accent"];
        setWeekEvents((data ?? []).map((e: any, i: number) => {
          const d = new Date(e.starts_at);
          return {
            day: (d.getDay() + 6) % 7,
            time: d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
            title: e.title,
            attendee: Array.isArray(e.attendees) && e.attendees[0] ? String(e.attendees[0]) : "",
            color: colors[i % colors.length],
          };
        }));
      });

    (supabase.from("grocery_items") as any)
      .select("id, name, category, checked")
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }: any) => setGroceryItems(data ?? []));

    (supabase.from("tasks") as any)
      .select("id, title, assignee, due_date, priority, category, completed")
      .eq("completed", false)
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(5)
      .then(({ data }: any) => setTasks((data ?? []).map((t: any) => ({
        id: t.id,
        title: t.title,
        assignee: { name: t.assignee || "Unassigned" },
        dueDate: t.due_date ? new Date(t.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—",
        priority: (t.priority as "low" | "medium" | "high") || "medium",
        category: t.category || "General",
      }))));

    (supabase.from("family_members") as any)
      .select("id, name, role, status")
      .limit(8)
      .then(({ data }: any) => setFamilyMembers((data ?? []).map((m: any) => ({
        id: m.id, name: m.name, role: m.role, status: m.status === "away" ? "away" : "active",
      }))));

    (supabase.from("notifications") as any)
      .select("id, title, message, type, urgent, created_at")
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }: any) => setAlerts((data ?? []).map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: (["alert", "success", "info"].includes(n.type) ? n.type : "info") as "alert" | "success" | "info",
        time: new Date(n.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        urgent: !!n.urgent,
      }))));
  }, [user?.id]);

  const [suggestions, setSuggestions] = useState([
    {
      id: "1",
      type: "task" as const,
      title: "Optimize Task Distribution",
      description: "Redistribute 3 tasks based on availability",
      action: "Optimize",
      confidence: 92
    }
  ]);

  const agentActivities = [
    {
      agent: "coordinator" as const,
      status: "working" as const,
      currentTask: "Analyzing schedule patterns..."
    },
    {
      agent: "task" as const,
      status: "completed" as const,
      lastAction: "Optimized task assignments",
      actionTime: "5 min ago"
    },
    {
      agent: "reminder" as const,
      status: "idle" as const
    },
    {
      agent: "grocery" as const,
      status: "working" as const,
      currentTask: "Updating shopping list..."
    }
  ];

  const conflict = {
    id: "1",
    type: "time_overlap" as const,
    severity: "high" as const,
    event1: {
      title: "Soccer Practice",
      time: "Monday 3:00 PM",
      attendees: ["Sarah", "Coach"]
    },
    event2: {
      title: "Dentist Appointment",
      time: "Monday 3:00 PM",
      attendees: ["Sarah", "Mom"]
    },
    aiSolution: {
      description: "Reschedule dentist to Tuesday 2pm (confirmed availability)",
      confidence: 94
    }
  };

  const toggleGroceryItem = async (id: string) => {
    const item = groceryItems.find((i) => i.id === id);
    if (!item) return;
    setGroceryItems((items) => items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
    await (supabase.from("grocery_items") as any).update({ checked: !item.checked }).eq("id", id);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Dashboard</h1>
          <p className="text-muted-foreground">{todayLabel} • {greeting}, {firstName}</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - AI & Insights */}
          <div className="col-span-3 space-y-6">
            <AIAgentPanel activities={agentActivities} />

            <FamilyMembersCard members={familyMembers} />

            {suggestions.map(suggestion => (
              <AISuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onAccept={(id) => setSuggestions(s => s.filter(item => item.id !== id))}
                onDismiss={(id) => setSuggestions(s => s.filter(item => item.id !== id))}
              />
            ))}
          </div>

          {/* Center Column - Main Content */}
          <div className="col-span-6 space-y-6">
            {/* AI Command */}
            <AICommandBar onSubmit={handleAICommand} placeholder="What can I help you with today?" />

            {/* AI Insights */}
            <AIInsightCard
              insight={{
                type: "analysis",
                title: "Household Intelligence Report",
                description: "Your week has been optimized. I've found time savings, resolved conflicts, and streamlined your grocery shopping.",
                metrics: [
                  { label: "Time Saved", value: "3.5 hrs", status: "success" },
                  { label: "Conflicts Resolved", value: "2", status: "success" },
                  { label: "Tasks Optimized", value: "8", status: "info" }
                ]
              }}
            />

            {/* Conflict Resolution */}
            <ConflictResolutionCard
              conflict={conflict}
              onResolve={(id, solution) => console.log("Resolve:", id, solution)}
              onDismiss={(id) => console.log("Dismiss:", id)}
            />

            {/* Calendar */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h3>Weekly Overview</h3>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-3 mb-6">
                {weekDays.map((day, idx) => {
                  const isToday = idx === todayIdx;
                  const dayEvents = weekEvents.filter(e => e.day === idx);

                  return (
                    <div key={idx} className="text-center">
                      <div className="text-sm text-muted-foreground mb-3">{day}</div>
                      <div
                        className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-2 ${
                          isToday ? 'bg-primary text-primary-foreground' : 'bg-white/30'
                        }`}
                      >
                        {weekDates[idx]}
                      </div>
                      {dayEvents.length > 0 && (
                        <div className="flex flex-col gap-1">
                          {dayEvents.map((_, i) => (
                            <div key={i} className="w-full h-1 rounded-full bg-accent/50" />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                {weekEvents
                  .filter(e => e.day === todayIdx)
                  .map((event, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/30 hover:bg-white/50 transition-colors"
                    >
                      <div className={`w-1 h-10 ${event.color} rounded-full`} />
                      <div className="flex-1">
                        <h4 className="text-sm">{event.title}</h4>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                      {event.attendee && (
                        <Avatar className="w-7 h-7">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {event.attendee[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                {weekEvents.filter(e => e.day === todayIdx).length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">No events today.</div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Tasks & Lists */}
          <div className="col-span-3 space-y-6">
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-secondary" />
                  <h3>Active Tasks</h3>
                </div>
              </div>
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No active tasks. 🎉</div>
                ) : tasks.map(task => (
                  <TaskCard key={task.id} {...task} />
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <h3>Grocery List</h3>
                </div>
                <span className="text-sm text-muted-foreground">
                  {groceryItems.filter(i => !i.checked).length} items
                </span>
              </div>

              <div className="space-y-2">
                {groceryItems.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Your list is empty.</div>
                ) : groceryItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/30 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={() => toggleGroceryItem(item.id)}
                    />
                    <span className={`flex-1 text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                      {item.name}
                    </span>
                  </label>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <h3>Alerts</h3>
              </div>

              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="text-sm text-muted-foreground">All caught up. No alerts.</div>
                ) : alerts.map(a => (
                  <NotificationCard key={a.id} title={a.title} message={a.message} type={a.type} time={a.time} urgent={a.urgent} />
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
