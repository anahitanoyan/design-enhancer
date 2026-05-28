import { Calendar, CheckSquare, ShoppingCart, Bell, Settings } from "lucide-react";
import { GlassCard } from "../oikos/GlassCard";
import { AICommandBar } from "../oikos/AICommandBar";
import { TaskCard } from "../oikos/TaskCard";
import { NotificationCard } from "../oikos/NotificationCard";
import { FamilyMembersCard } from "../oikos/FamilyMembersCard";
import { AIAgentPanel } from "../oikos/AIAgentPanel";
import { AISuggestionCard } from "../oikos/AISuggestionCard";
import { AIInsightCard } from "../oikos/AIInsightCard";
import { ConflictResolutionCard } from "../oikos/ConflictResolutionCard";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function EnhancedWebDashboard() {
  const [groceryItems, setGroceryItems] = useState([
    { id: "1", name: "Milk", category: "Dairy", checked: false },
    { id: "2", name: "Bread", category: "Bakery", checked: true },
    { id: "3", name: "Apples", category: "Fruits", checked: false },
    { id: "4", name: "Chicken", category: "Meat", checked: false }
  ]);

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

  const tasks = [
    {
      id: "1",
      title: "Clean garage",
      assignee: { name: "John Doe" },
      dueDate: "Apr 22",
      priority: "medium" as const,
      category: "Home"
    },
    {
      id: "2",
      title: "Buy birthday gift",
      assignee: { name: "Jane Doe" },
      dueDate: "Apr 23",
      priority: "high" as const,
      category: "Personal"
    }
  ];

  const familyMembers = [
    { id: "1", name: "John Doe", role: "Parent", status: "active" as const },
    { id: "2", name: "Jane Doe", role: "Parent", status: "active" as const },
    { id: "3", name: "Sarah Doe", role: "Child", status: "away" as const },
    { id: "4", name: "Mike Doe", role: "Child", status: "active" as const }
  ];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekDates = [19, 20, 21, 22, 23, 24, 25];

  const events = [
    { day: 2, time: "9:00 AM", title: "Team Meeting", attendee: "John", color: "bg-primary" },
    { day: 2, time: "12:30 PM", title: "Lunch", attendee: "Jane", color: "bg-secondary" },
    { day: 2, time: "4:00 PM", title: "Soccer", attendee: "Sarah", color: "bg-accent" }
  ];

  const toggleGroceryItem = (id: string) => {
    setGroceryItems(items =>
      items.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Tuesday, April 21, 2026 • Good morning, John</p>
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
            <AICommandBar onSubmit={(cmd) => console.log(cmd)} placeholder="What can I help you with today?" />

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
                  const isToday = idx === 2;
                  const dayEvents = events.filter(e => e.day === idx);

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
                {events
                  .filter(e => e.day === 2)
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
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {event.attendee[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ))}
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
                {tasks.map(task => (
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
                {groceryItems.map((item) => (
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
                <NotificationCard
                  title="Schedule Conflict"
                  message="Soccer overlaps with dentist on Monday"
                  type="alert"
                  time="5 min ago"
                  urgent
                />
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
