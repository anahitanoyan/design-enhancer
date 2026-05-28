import { Bell } from "lucide-react";
import { GlassCard } from "@/components/oikos/GlassCard";
import { AICommandBar } from "@/components/oikos/AICommandBar";
import { CalendarCard } from "@/components/oikos/CalendarCard";
import { GroceryListCard } from "@/components/oikos/GroceryListCard";
import { FamilyMembersCard } from "@/components/oikos/FamilyMembersCard";
import { AIAgentPanel } from "@/components/oikos/AIAgentPanel";
import { AISuggestionCard } from "@/components/oikos/AISuggestionCard";
import { AIInsightCard } from "@/components/oikos/AIInsightCard";
import { FloatingAIButton } from "@/components/oikos/FloatingAIButton";
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
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl mb-1">{greeting}{firstName ? `, ${firstName}` : ""}</h1>
            <p className="text-sm text-muted-foreground">{todayLabel}</p>
          </div>
          <button onClick={() => onNavigate('notifications')} className="relative" aria-label={t("notifications")}>
            <Bell className="w-6 h-6 text-foreground" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-alert rounded-full text-[10px] text-white flex items-center justify-center">
                {unread}
              </span>
            )}
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
        <CalendarCard date="Today's Schedule" events={todayEvents.length ? todayEvents : [{ id: "empty", title: "No events today — tap + to plan your day", time: "", attendees: [] }]} />

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
