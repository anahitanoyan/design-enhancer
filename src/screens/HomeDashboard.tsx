import { CalendarDays, CheckSquare, Bell, ShoppingCart, Bot, Calendar } from "lucide-react";
import { GlassCard } from "../oikos/GlassCard";
import { AICommandBar } from "../oikos/AICommandBar";
import { CalendarCard } from "../oikos/CalendarCard";
import { GroceryListCard } from "../oikos/GroceryListCard";
import { FamilyMembersCard } from "../oikos/FamilyMembersCard";
import { StatusBadge } from "../oikos/StatusBadge";
import { useState } from "react";

export function HomeDashboard({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [groceryItems, setGroceryItems] = useState([
    { id: "1", name: "Milk", category: "Dairy", checked: false },
    { id: "2", name: "Bread", category: "Bakery", checked: true },
    { id: "3", name: "Apples", category: "Fruits", checked: false },
    { id: "4", name: "Chicken", category: "Meat", checked: false },
    { id: "5", name: "Tomatoes", category: "Vegetables", checked: false }
  ]);

  const todayEvents = [
    { id: "1", title: "Team Meeting", time: "9:00 AM", attendees: ["John", "Sarah"] },
    { id: "2", title: "Lunch with Family", time: "12:30 PM", attendees: ["Mom", "Dad", "Sister"] },
    { id: "3", title: "Soccer Practice", time: "4:00 PM", attendees: ["Coach", "Team"] }
  ];

  const familyMembers = [
    { id: "1", name: "John Doe", role: "Parent", status: "active" as const },
    { id: "2", name: "Jane Doe", role: "Parent", status: "active" as const },
    { id: "3", name: "Sarah Doe", role: "Child", status: "away" as const },
    { id: "4", name: "Mike Doe", role: "Child", status: "active" as const }
  ];

  const handleAICommand = (command: string) => {
    console.log("AI Command:", command);
  };

  const toggleGroceryItem = (id: string) => {
    setGroceryItems(items =>
      items.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl mb-1">Good Morning</h1>
            <p className="text-sm text-muted-foreground">Tuesday, April 21, 2026</p>
          </div>
          <button onClick={() => onNavigate('notifications')} className="relative">
            <Bell className="w-6 h-6 text-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-alert rounded-full text-[10px] text-white flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        <AICommandBar onSubmit={handleAICommand} placeholder="Plan my week, organize tasks..." />

        <GlassCard gradient="mixed" className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-5 h-5 text-accent" />
            <h3 className="text-sm">AI Insights</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Your week looks busy! I've identified 2 scheduling conflicts and optimized your grocery list.
          </p>
          <div className="flex gap-2 flex-wrap">
            <StatusBadge variant="warning">2 Conflicts</StatusBadge>
            <StatusBadge variant="success">List Optimized</StatusBadge>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 gap-3">
          <GlassCard onClick={() => onNavigate('schedule')} className="p-4">
            <Calendar className="w-6 h-6 text-primary mb-2" />
            <h3 className="text-sm mb-1">Schedule</h3>
            <p className="text-xs text-muted-foreground">3 events today</p>
          </GlassCard>

          <GlassCard onClick={() => onNavigate('tasks')} className="p-4">
            <CheckSquare className="w-6 h-6 text-secondary mb-2" />
            <h3 className="text-sm mb-1">Tasks</h3>
            <p className="text-xs text-muted-foreground">8 pending</p>
          </GlassCard>
        </div>

        <CalendarCard date="Today's Schedule" events={todayEvents} />

        <GroceryListCard
          items={groceryItems}
          onToggle={toggleGroceryItem}
          onAdd={() => onNavigate('grocery')}
        />

        <FamilyMembersCard members={familyMembers} />
      </div>
    </div>
  );
}
