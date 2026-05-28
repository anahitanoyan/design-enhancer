import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, TrendingUp, Calendar, CheckSquare, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/oikos/GlassCard";
import { StatusBadge } from "@/components/oikos/StatusBadge";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AnalyticsDashboard({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [grocery, setGrocery] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    const since = new Date(); since.setDate(since.getDate() - 28);
    (supabase.from("tasks") as any).select("id, completed, due_date, created_at, assignee, category")
      .gte("created_at", since.toISOString()).then(({ data }: any) => setTasks(data ?? []));
    (supabase.from("events") as any).select("id, starts_at, event_type")
      .gte("starts_at", since.toISOString()).then(({ data }: any) => setEvents(data ?? []));
    (supabase.from("grocery_items") as any).select("id, created_at, checked")
      .gte("created_at", since.toISOString()).then(({ data }: any) => setGrocery(data ?? []));
  }, [user?.id]);

  const weeklyData = useMemo(() => {
    const start = new Date(); start.setDate(start.getDate() - 6); start.setHours(0, 0, 0, 0);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i);
      return { day: DAYS[d.getDay()], date: d.toDateString(), tasks: 0, events: 0, grocery: 0 };
    });
    const key = (d: Date) => d.toDateString();
    tasks.forEach((t) => { const d = days.find((x) => x.date === key(new Date(t.created_at))); if (d) d.tasks++; });
    events.forEach((e) => { const d = days.find((x) => x.date === key(new Date(e.starts_at))); if (d) d.events++; });
    grocery.forEach((g) => { const d = days.find((x) => x.date === key(new Date(g.created_at))); if (d) d.grocery++; });
    return days.map(({ date, ...rest }) => rest);
  }, [tasks, events, grocery]);

  const taskDistribution = useMemo(() => {
    const palette = ["#0F3D5E", "#1E6F8C", "#4FB3BF", "#FF9800", "#9C27B0"];
    const map = new Map<string, number>();
    tasks.forEach((t) => { const k = t.assignee || "Unassigned"; map.set(k, (map.get(k) ?? 0) + 1); });
    return Array.from(map.entries()).slice(0, 5).map(([name, value], i) => ({ name, value, color: palette[i] }));
  }, [tasks]);

  const productivity = useMemo(() => {
    const weeks = Array.from({ length: 4 }, (_, i) => {
      const end = new Date(); end.setDate(end.getDate() - (3 - i) * 7);
      const start = new Date(end); start.setDate(end.getDate() - 6);
      return { label: `Week ${i + 1}`, start, end, completed: 0, total: 0 };
    });
    tasks.forEach((t) => {
      const c = new Date(t.created_at);
      const w = weeks.find((wk) => c >= wk.start && c <= wk.end);
      if (w) { w.total++; if (t.completed) w.completed++; }
    });
    return weeks.map((w) => ({ week: w.label, completed: w.completed, total: w.total }));
  }, [tasks]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const completionRate = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const avgPerDay = (tasks.length / 28).toFixed(1);
  const peakDay = useMemo(() => {
    if (!weeklyData.length) return "—";
    return weeklyData.reduce((a, b) => (b.tasks > a.tasks ? b : a)).day;
  }, [weeklyData]);

  const insights = [
    { title: "Peak Day", value: peakDay, change: `${tasks.length} tasks`, trend: "up" as const, description: "Last 7 days" },
    { title: "Avg Tasks/Day", value: avgPerDay, change: "28d avg", trend: "up" as const, description: "Across last 4 weeks" },
    { title: "Completion Rate", value: `${completionRate}%`, change: `${completedCount}/${tasks.length}`, trend: "up" as const, description: "Tasks completed" },
    { title: "Events Logged", value: String(events.length), change: "28d", trend: "up" as const, description: "Across calendar" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF5F0] via-[#E8F4F8] to-[#F0F8FF]">
      {/* Header */}
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2>Analytics & Insights</h2>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24 space-y-4">
        {/* AI-Generated Insights */}
        <GlassCard gradient="mixed" className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3>AI Summary</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Your household productivity increased by 15% this month. Peak performance on Fridays, with AI automation saving 12 hours of manual work.
          </p>
          <div className="flex gap-2 flex-wrap">
            <StatusBadge variant="success">+15% Productivity</StatusBadge>
            <StatusBadge variant="info">12 hrs saved</StatusBadge>
          </div>
        </GlassCard>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {insights.map((insight, idx) => (
            <GlassCard key={idx} className="p-4">
              <div className="mb-2">
                <p className="text-xs text-muted-foreground mb-1">{insight.title}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-primary">{insight.value}</span>
                  <span className={`text-xs ${insight.trend === 'up' ? 'text-success' : 'text-alert'}`}>
                    {insight.change}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
            </GlassCard>
          ))}
        </div>

        {/* Weekly Activity Chart */}
        <GlassCard className="p-4">
          <h3 className="mb-4">Weekly Activity</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar key="tasks-bar" dataKey="tasks" fill="#0F3D5E" radius={[8, 8, 0, 0]} />
                <Bar key="events-bar" dataKey="events" fill="#1E6F8C" radius={[8, 8, 0, 0]} />
                <Bar key="grocery-bar" dataKey="grocery" fill="#4FB3BF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-xs text-muted-foreground">Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-xs text-muted-foreground">Grocery</span>
            </div>
          </div>
        </GlassCard>

        {/* Task Distribution by Member */}
        <GlassCard className="p-4">
          <h3 className="mb-4">Task Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Productivity Trend */}
        <GlassCard className="p-4">
          <h3 className="mb-4">Productivity Trend</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Line key="completed-line" type="monotone" dataKey="completed" stroke="#4CAF50" strokeWidth={3} dot={{ r: 4 }} />
                <Line key="total-line" type="monotone" dataKey="total" stroke="#0F3D5E" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
          </div>
        </GlassCard>

        {/* Category Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-primary" />
              <h4 className="text-sm font-medium">Events</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Work</span>
                <span className="font-medium">42%</span>
              </div>
              <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '42%' }} />
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Personal</span>
                <span className="font-medium">35%</span>
              </div>
              <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-secondary" style={{ width: '35%' }} />
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Family</span>
                <span className="font-medium">23%</span>
              </div>
              <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-accent" style={{ width: '23%' }} />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckSquare className="w-5 h-5 text-secondary" />
              <h4 className="text-sm font-medium">Tasks</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Home</span>
                <span className="font-medium">38%</span>
              </div>
              <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '38%' }} />
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Personal</span>
                <span className="font-medium">32%</span>
              </div>
              <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-secondary" style={{ width: '32%' }} />
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Work</span>
                <span className="font-medium">30%</span>
              </div>
              <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-accent" style={{ width: '30%' }} />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
