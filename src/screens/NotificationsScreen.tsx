import { ArrowLeft, Bell, CheckCheck, Loader2, AlertCircle, CheckCircle, Info, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

type Notif = {
  id: string;
  title: string;
  message: string;
  type: "alert" | "success" | "info";
  urgent: boolean;
  read: boolean;
  created_at: string;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await (supabase.from("notifications") as any)
      .select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) toast.error(error.message);
    else setItems((data ?? []) as Notif[]);
  };
  useEffect(() => { load(); }, [user?.id]);

  const markRead = async (n: Notif) => {
    if (n.read) return;
    await (supabase.from("notifications") as any).update({ read: true }).eq("id", n.id);
    setItems(items.map(x => x.id === n.id ? { ...x, read: true } : x));
  };

  const markAllRead = async () => {
    if (!user?.id) return;
    const { error } = await (supabase.from("notifications") as any)
      .update({ read: true }).eq("owner_id", user.id).eq("read", false);
    if (error) toast.error(error.message);
    else { toast.success("All marked as read"); load(); }
  };

  const remove = async (n: Notif) => {
    const { error } = await (supabase.from("notifications") as any).delete().eq("id", n.id);
    if (error) toast.error(error.message);
    else { setItems(items.filter(x => x.id !== n.id)); toast.success("Deleted"); }
  };

  const icons = {
    alert: <AlertCircle className="w-5 h-5 text-alert" />,
    success: <CheckCircle className="w-5 h-5 text-success" />,
    info: <Info className="w-5 h-5 text-accent" />,
  };

  const card = (n: Notif) => (
    <div key={n.id} onClick={() => markRead(n)}
      className={`glass-card p-4 cursor-pointer ${n.urgent ? "border-l-4 border-alert" : ""} ${!n.read ? "ring-1 ring-primary/30" : "opacity-75"}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icons[n.type]}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4>{n.title}</h4>
            {!n.read && <span className="w-2 h-2 rounded-full bg-primary" />}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{n.message}</p>
          <span className="text-xs text-muted-foreground">{timeAgo(n.created_at)}</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); remove(n); }} aria-label="Delete" className="text-alert hover:opacity-70">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const unread = items.filter(i => !i.read);
  const read = items.filter(i => i.read);
  const urgent = items.filter(i => i.urgent);

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} aria-label="Back"><ArrowLeft className="w-6 h-6" /></button>
        <Bell className="w-6 h-6 text-primary" />
        <h2>Notifications</h2>
        {unread.length > 0 && (
          <button onClick={markAllRead} className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90">
            <CheckCheck className="w-3.5 h-3.5" />Mark all read
          </button>
        )}
      </div>

      <div className="p-4 pb-24">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">You're all caught up.</p>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="glass-card w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All ({items.length})</TabsTrigger>
              <TabsTrigger value="urgent">Urgent ({urgent.length})</TabsTrigger>
              <TabsTrigger value="read">Read ({read.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-3">{items.map(card)}</TabsContent>
            <TabsContent value="urgent" className="space-y-3">
              {urgent.length === 0 ? <p className="text-center text-sm text-muted-foreground py-6">No urgent notifications.</p> : urgent.map(card)}
            </TabsContent>
            <TabsContent value="read" className="space-y-3">
              {read.length === 0 ? <p className="text-center text-sm text-muted-foreground py-6">Nothing read yet.</p> : read.map(card)}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
