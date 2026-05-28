import { ArrowLeft, TrendingUp, Calendar, CheckSquare, ShoppingCart, Clock, Users, Sparkles } from "lucide-react";
import { GlassCard } from "../oikos/GlassCard";
import { StatusBadge } from "../oikos/StatusBadge";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function AnalyticsDashboard({ onBack }: { onBack: () => void }) {
  const weeklyData = [
    { day: "Mon", tasks: 8, events: 3, grocery: 2 },
    { day: "Tue", tasks: 12, events: 5, grocery: 1 },
    { day: "Wed", tasks: 6, events: 4, grocery: 3 },
    { day: "Thu", tasks: 9, events: 2, grocery: 1 },
    { day: "Fri", tasks: 15, events: 6, grocery: 2 },
    { day: "Sat", tasks: 4, events: 1, grocery: 4 },
    { day: "Sun", tasks: 3, events: 2, grocery: 1 }
  ];

  const taskDistribution = [
    { name: "John", value: 35, color: "#0F3D5E" },
    { name: "Jane", value: 28, color: "#1E6F8C" },
    { name: "Sarah", value: 20, color: "#4FB3BF" },
    { name: "Mike", value: 17, color: "#FF9800" }
  ];

  const productivity = [
    { week: "Week 1", completed: 45, total: 52 },
    { week: "Week 2", completed: 52, total: 58 },
    { week: "Week 3", completed: 48, total: 55 },
    { week: "Week 4", completed: 61, total: 65 }
  ];

  const insights = [
    {
      title: "Peak Productivity",
      value: "Friday",
      change: "+23%",
      trend: "up" as const,
      description: "Most tasks completed on Fridays"
    },
    {
      title: "Average Tasks/Day",
      value: "8.4",
      change: "+12%",
      trend: "up" as const,
      description: "Increased from last month"
    },
    {
      title: "On-Time Completion",
      value: "94%",
      change: "+5%",
      trend: "up" as const,
      description: "Tasks completed by deadline"
    },
    {
      title: "Time Saved by AI",
      value: "12 hrs",
      change: "+8 hrs",
      trend: "up" as const,
      description: "This month vs last month"
    }
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
