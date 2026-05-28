import { Bell } from "lucide-react";
import { GlassCard } from "../oikos/GlassCard";
import { AICommandBar } from "../oikos/AICommandBar";
import { CalendarCard } from "../oikos/CalendarCard";
import { GroceryListCard } from "../oikos/GroceryListCard";
import { FamilyMembersCard } from "../oikos/FamilyMembersCard";
import { AIAgentPanel } from "../oikos/AIAgentPanel";
import { AISuggestionCard } from "../oikos/AISuggestionCard";
import { AIInsightCard } from "../oikos/AIInsightCard";
import { FloatingAIButton } from "../oikos/FloatingAIButton";
import { useState } from "react";

export function EnhancedHomeDashboard({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [groceryItems, setGroceryItems] = useState([
    { id: "1", name: "Milk", category: "Dairy", checked: false },
    { id: "2", name: "Bread", category: "Bakery", checked: true },
    { id: "3", name: "Apples", category: "Fruits", checked: false },
    { id: "4", name: "Chicken", category: "Meat", checked: false },
    { id: "5", name: "Tomatoes", category: "Vegetables", checked: false }
  ]);

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
    onNavigate("ai");
  };

  const toggleGroceryItem = (id: string) => {
    setGroceryItems(items =>
      items.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
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
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
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

        {/* AI Command Bar */}
        <AICommandBar onSubmit={handleAICommand} placeholder="What would you like me to do today?" />

        {/* AI Agent Status - Compact View */}
        <GlassCard className="p-4">
          <h3 className="text-sm mb-3">AI Agents Active</h3>
          <AIAgentPanel activities={agentActivities} compact />
        </GlassCard>

        {/* AI Insights */}
        <AIInsightCard
          insight={{
            type: "analysis",
            title: "Weekly Analysis Complete",
            description: "I've analyzed your household's week and found optimization opportunities",
            metrics: [
              { label: "Conflicts", value: "2", status: "warning" },
              { label: "Optimizations", value: "5", status: "success" },
              { label: "Savings", value: "3 hours", status: "info" }
            ],
            actions: [
              { label: "View Details", onClick: () => onNavigate("ai") }
            ]
          }}
        />

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm text-muted-foreground px-1">AI Recommendations</h3>
            {suggestions.map(suggestion => (
              <AISuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onAccept={handleAcceptSuggestion}
                onDismiss={handleDismissSuggestion}
              />
            ))}
          </div>
        )}

        {/* Today's Schedule */}
        <CalendarCard date="Today's Schedule" events={todayEvents} />

        {/* Grocery List */}
        <GroceryListCard
          items={groceryItems}
          onToggle={toggleGroceryItem}
          onAdd={() => onNavigate('grocery')}
        />

        {/* Family Members */}
        <FamilyMembersCard members={familyMembers} />
      </div>

      {/* Floating AI Assistant */}
      <FloatingAIButton onAction={handleFloatingAction} />
    </div>
  );
}
