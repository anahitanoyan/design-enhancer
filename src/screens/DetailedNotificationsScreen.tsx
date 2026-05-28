import { ArrowLeft, Bell, Search, CheckCheck, Trash2 } from "lucide-react";
import { NotificationCard } from "@/components/oikos/NotificationCard";
import { GlassCard } from "@/components/oikos/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type Notif = {
  id: string;
  title: string;
  message: string;
  type: "alert" | "success" | "info";
  urgent: boolean;
  read: boolean;
  created_at: string;
};

export function DetailedNotificationsScreen({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "alert" | "success" | "info">("all");
  const [items, setItems] = useState<Notif[]>([]);

  const load = () => {
    if (!user?.id) return;
    (supabase.from("notifications") as any)
      .select("id, title, message, type, urgent, read, created_at")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }: any) => setItems((data ?? []).map((n: any) => ({
        ...n,
        type: (["alert", "success", "info"].includes(n.type) ? n.type : "info"),
      }))));
  };
  useEffect(load, [user?.id]);

  const fmtTime = (iso: string) => {
    const d = new Date(iso);
    const diff = (Date.now() - d.getTime()) / 60000;
    if (diff < 60) return `${Math.max(1, Math.round(diff))} min ago`;
    if (diff < 60 * 24) return `${Math.round(diff / 60)} hr ago`;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const markAllRead = async () => {
    const unread = items.filter((n) => !n.read).map((n) => n.id);
    if (!unread.length) return;
    setItems((xs) => xs.map((n) => ({ ...n, read: true })));
    await (supabase.from("notifications") as any).update({ read: true }).in("id", unread);
  };
  const clearRead = async () => {
    const readIds = items.filter((n) => n.read).map((n) => n.id);
    if (!readIds.length) return;
    setItems((xs) => xs.filter((n) => !n.read));
    await (supabase.from("notifications") as any).delete().in("id", readIds);
  };

  const enrich = (n: Notif) => ({ ...n, time: fmtTime(n.created_at) });
  const filterNotifications = (list: Notif[]) => {
    let f = list;
    if (filterType !== "all") f = f.filter((n) => n.type === filterType);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      f = f.filter((n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q));
    }
    return f;
  };

  const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0);
  const urgent = items.filter((n) => n.urgent && !n.read);
  const today = items.filter((n) => !n.urgent && new Date(n.created_at) >= dayStart);
  const earlier = items.filter((n) => !n.urgent && new Date(n.created_at) < dayStart);
  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF5F0] via-[#E8F4F8] to-[#F0F8FF]">
      {/* Header */}
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Bell className="w-6 h-6 text-primary" />
        <h2>Notifications</h2>
        <div className="ml-auto flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="px-2 py-1 rounded-full bg-alert text-white text-xs font-medium">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24 space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={markAllRead} className="glass-card p-3 flex items-center justify-center gap-2 hover:bg-white/50 transition-colors">
            <CheckCheck className="w-4 h-4 text-success" />
            <span className="text-sm">Mark All Read</span>
          </button>
          <button onClick={clearRead} className="glass-card p-3 flex items-center justify-center gap-2 hover:bg-white/50 transition-colors">
            <Trash2 className="w-4 h-4 text-alert" />
            <span className="text-sm">Clear Read</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="glass-card p-3 flex items-center gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                filterType === "all"
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-card'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("alert")}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                filterType === "alert"
                  ? 'bg-alert text-white'
                  : 'glass-card'
              }`}
            >
              Alerts
            </button>
            <button
              onClick={() => setFilterType("success")}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                filterType === "success"
                  ? 'bg-success text-white'
                  : 'glass-card'
              }`}
            >
              Success
            </button>
            <button
              onClick={() => setFilterType("info")}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                filterType === "info"
                  ? 'bg-accent text-white'
                  : 'glass-card'
              }`}
            >
              Info
            </button>
          </div>
        </div>

        {/* Notifications Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="glass-card w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="all">
              All ({filterNotifications(items).length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="read">
              Read ({items.length - unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filterNotifications(urgent).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-alert px-1">Urgent</h3>
                {filterNotifications(urgent).map((n) => (
                  <NotificationCard key={n.id} {...enrich(n)} />
                ))}
              </div>
            )}

            {filterNotifications(today).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground px-1">Today</h3>
                {filterNotifications(today).map((n) => (
                  <NotificationCard key={n.id} {...enrich(n)} />
                ))}
              </div>
            )}

            {filterNotifications(earlier).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground px-1">Earlier</h3>
                {filterNotifications(earlier).map((n) => (
                  <NotificationCard key={n.id} {...enrich(n)} />
                ))}
              </div>
            )}

            {filterNotifications(items).length === 0 && (
              <GlassCard className="p-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No notifications found</p>
              </GlassCard>
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-3">
            {items.filter((n) => !n.read).length === 0 ? (
              <GlassCard className="p-8 text-center">
                <CheckCheck className="w-12 h-12 text-success mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">All caught up!</p>
              </GlassCard>
            ) : (
              items.filter((n) => !n.read).map((n) => (
                <NotificationCard key={n.id} {...enrich(n)} />
              ))
            )}
          </TabsContent>

          <TabsContent value="read" className="space-y-3">
            {items.filter((n) => n.read).length === 0 ? (
              <GlassCard className="p-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No read notifications</p>
              </GlassCard>
            ) : (
              items.filter((n) => n.read).map((n) => (
                <NotificationCard key={n.id} {...enrich(n)} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
