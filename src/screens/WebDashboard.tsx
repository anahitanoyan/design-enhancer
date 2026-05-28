import { Calendar, CheckSquare, ShoppingCart, Bell, Sparkles, Bot, Users, Settings } from "lucide-react";
import { GlassCard } from "@/components/oikos/GlassCard";
import { AICommandBar } from "@/components/oikos/AICommandBar";
import { TaskCard } from "@/components/oikos/TaskCard";
import { NotificationCard } from "@/components/oikos/NotificationCard";
import { FamilyMembersCard } from "@/components/oikos/FamilyMembersCard";
import { StatusBadge } from "@/components/oikos/StatusBadge";
import { AIAgentStatus } from "@/components/oikos/AIAgentStatus";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function WebDashboard() {
  const [groceryItems, setGroceryItems] = useState([
    { id: "1", name: "Milk", category: "Dairy", checked: false },
    { id: "2", name: "Bread", category: "Bakery", checked: true },
    { id: "3", name: "Apples", category: "Fruits", checked: false },
    { id: "4", name: "Chicken", category: "Meat", checked: false }
  ]);

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
    },
    {
      id: "3",
      title: "Schedule dentist",
      assignee: { name: "Sarah Doe" },
      dueDate: "Apr 25",
      priority: "low" as const,
      category: "Health"
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
    { day: 2, time: "4:00 PM", title: "Soccer", attendee: "Sarah", color: "bg-accent" },
    { day: 3, time: "10:00 AM", title: "Doctor", attendee: "Mike", color: "bg-warning" },
    { day: 4, time: "3:00 PM", title: "Piano", attendee: "Sarah", color: "bg-success" }
  ];

  const toggleGroceryItem = (id: string) => {
    setGroceryItems(items =>
      items.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl mb-2">OikOS Dashboard</h1>
            <p className="text-muted-foreground">Tuesday, April 21, 2026</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-alert rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </button>
            <button className="p-2">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-6">
            <div className="col-span-full">
              <AICommandBar onSubmit={(cmd) => console.log(cmd)} placeholder="Ask AI to help organize your household..." />
            </div>

            <GlassCard gradient="mixed" className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Bot className="w-8 h-8 text-accent" />
                <div className="flex-1">
                  <h3 className="mb-2">AI Insights</h3>
                  <p className="text-muted-foreground mb-4">
                    Your week looks busy! I've identified 2 scheduling conflicts and optimized your grocery list based on meal plans.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <StatusBadge variant="warning" icon={<Bell className="w-3 h-3" />}>
                      2 Conflicts Detected
                    </StatusBadge>
                    <StatusBadge variant="success" icon={<CheckSquare className="w-3 h-3" />}>
                      List Optimized
                    </StatusBadge>
                    <StatusBadge variant="info" icon={<Sparkles className="w-3 h-3" />}>
                      5 AI Suggestions
                    </StatusBadge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <AIAgentStatus agent="coordinator" status="working" message="Analyzing this week's schedule..." />
                <AIAgentStatus agent="grocery" status="completed" message="Grocery list updated" />
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h3>Weekly Schedule</h3>
                </div>
                <button className="text-sm text-primary hover:underline">View All</button>
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

              <div className="space-y-3">
                <h4 className="text-sm text-muted-foreground">Today's Events</h4>
                {events
                  .filter(e => e.day === 2)
                  .map((event, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/30 hover:bg-white/50 transition-colors"
                    >
                      <div className={`w-1 h-12 ${event.color} rounded-full`} />
                      <div className="flex-1">
                        <h4 className="text-sm mb-1">{event.title}</h4>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {event.attendee[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-6 h-6 text-secondary" />
                  <h3>Active Tasks</h3>
                </div>
                <button className="text-sm text-primary hover:underline">View Board</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {tasks.map(task => (
                  <TaskCard key={task.id} {...task} />
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="col-span-4 space-y-6">
            <FamilyMembersCard members={familyMembers} />

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
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/30 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={() => toggleGroceryItem(item.id)}
                    />
                    <span className={`flex-1 text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                      {item.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                  </label>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <h3>Recent Notifications</h3>
              </div>

              <div className="space-y-3">
                <NotificationCard
                  title="Schedule Conflict"
                  message="Soccer practice overlaps with dentist on Monday"
                  type="alert"
                  time="5 min ago"
                  urgent
                />
                <NotificationCard
                  title="Task Completed"
                  message="John completed 'Grocery shopping'"
                  type="success"
                  time="2 hours ago"
                />
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
