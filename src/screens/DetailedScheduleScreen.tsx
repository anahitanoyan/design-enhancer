import { ArrowLeft, Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Users, Sparkles, Pencil, Trash2, Loader2, CalendarDays } from "lucide-react";
import { GlassCard } from "@/components/oikos/GlassCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/oikos/StatusBadge";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string;
  event_type: string;
  color: string;
  attendees: string[];
}

const typeColor: Record<string, string> = {
  work: "bg-primary", personal: "bg-secondary", activity: "bg-accent",
  health: "bg-warning", family: "bg-success",
};

function toLocalInput(iso: string) {
  const d = new Date(iso); const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(v: string) { return new Date(v).toISOString(); }
function startOfWeek(d: Date) {
  const x = new Date(d); const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day); x.setHours(0, 0, 0, 0); return x;
}

export function DetailedScheduleScreen({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [weekOffset, setWeekOffset] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EventRow | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", location: "",
    starts_at: toLocalInput(new Date().toISOString()),
    ends_at: toLocalInput(new Date(Date.now() + 3600000).toISOString()),
    event_type: "personal", attendees: "",
  });

  const weekStart = useMemo(() => {
    const s = startOfWeek(new Date()); s.setDate(s.getDate() + weekOffset * 7); return s;
  }, [weekOffset]);
  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart); d.setDate(d.getDate() + i); return d;
  }), [weekStart]);
  const todayIdx = weekDates.findIndex(d => d.toDateString() === new Date().toDateString());
  const [selectedDay, setSelectedDay] = useState(todayIdx >= 0 ? todayIdx : 0);
  const weekDayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const loadEvents = async () => {
    if (!user?.id) return;
    setLoading(true);
    const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 7);
    const { data, error } = await (supabase.from("events") as any)
      .select("*")
      .gte("starts_at", weekStart.toISOString())
      .lt("starts_at", weekEnd.toISOString())
      .order("starts_at");
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setEvents((data as EventRow[]) || []);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadEvents(); }, [user?.id, weekStart.toISOString()]);

  const getDayEvents = (idx: number) =>
    events.filter(e => new Date(e.starts_at).toDateString() === weekDates[idx].toDateString());

  const openCreate = () => {
    setEditing(null);
    const base = new Date(weekDates[selectedDay] ?? new Date()); base.setHours(9, 0, 0, 0);
    const end = new Date(base); end.setHours(end.getHours() + 1);
    setForm({
      title: "", description: "", location: "",
      starts_at: toLocalInput(base.toISOString()),
      ends_at: toLocalInput(end.toISOString()),
      event_type: "personal", attendees: "",
    });
    setDialogOpen(true);
  };
  const openEdit = (e: EventRow) => {
    setEditing(e);
    setForm({
      title: e.title, description: e.description ?? "", location: e.location ?? "",
      starts_at: toLocalInput(e.starts_at), ends_at: toLocalInput(e.ends_at),
      event_type: e.event_type, attendees: (e.attendees ?? []).join(", "),
    });
    setDialogOpen(true);
  };
  const save = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    const payload = {
      title: form.title.trim(),
      description: form.description || null,
      location: form.location || null,
      starts_at: fromLocalInput(form.starts_at),
      ends_at: fromLocalInput(form.ends_at),
      event_type: form.event_type,
      color: typeColor[form.event_type] ?? "bg-primary",
      attendees: form.attendees.split(",").map(s => s.trim()).filter(Boolean),
      owner_id: user?.id,
    };
    if (editing) {
      const { error } = await (supabase.from("events") as any).update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Event updated");
    } else {
      const { error } = await (supabase.from("events") as any).insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Event created");
    }
    setDialogOpen(false); loadEvents();
  };
  const remove = async (id: string) => {
    const { error } = await (supabase.from("events") as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Event deleted"); loadEvents();
  };

  const todayEvents = getDayEvents(selectedDay);
  const monthLabel = weekStart.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}><ArrowLeft className="w-6 h-6" /></button>
        <CalendarIcon className="w-6 h-6 text-primary" />
        <h2>Schedule</h2>
        <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
          <PopoverTrigger asChild>
            <button className="ml-auto p-2 rounded-full bg-secondary text-secondary-foreground" aria-label="Jump to date">
              <CalendarDays className="w-5 h-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              fromYear={1970}
              toYear={2100}
              defaultMonth={weekDates[selectedDay] ?? new Date()}
              modifiers={{
                hasEvents: (d) => (eventCounts[d.toDateString()] ?? 0) > 0,
              }}
              modifiersClassNames={{ hasEvents: "font-bold text-primary" }}
              onSelect={(d) => {
                if (!d) return;
                const today = startOfWeek(new Date());
                const target = startOfWeek(d);
                const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);
                setWeekOffset(Math.round(diffDays / 7));
                const newSelected = ((d.getDay() + 6) % 7);
                setSelectedDay(newSelected);
                setPickerOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        <button onClick={openCreate} className="p-2 rounded-full bg-primary text-primary-foreground">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24 space-y-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setWeekOffset(weekOffset - 1)}><ChevronLeft className="w-6 h-6" /></button>
            <div className="text-center">
              <h3>{monthLabel}</h3>
              <p className="text-xs text-muted-foreground">Week of {weekStart.toLocaleDateString()}</p>
            </div>
            <button onClick={() => setWeekOffset(weekOffset + 1)}><ChevronRight className="w-6 h-6" /></button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDayLabels.map((day, idx) => {
              const dayEvents = getDayEvents(idx);
              const isToday = weekDates[idx].toDateString() === new Date().toDateString();
              return (
                <button key={idx} onClick={() => setSelectedDay(idx)} className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">{day}</div>
                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm transition-all ${
                    isToday ? 'bg-primary text-primary-foreground' :
                    selectedDay === idx ? 'bg-secondary text-secondary-foreground' : 'hover:bg-white/30'
                  }`}>{weekDates[idx].getDate()}</div>
                  {dayEvents.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-1">
                      {dayEvents.slice(0, 3).map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-accent" />)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard gradient="mixed" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h4 className="text-sm font-medium">Schedule Insights</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            {events.length === 0
              ? "No events this week — tap + to plan your first one."
              : `${events.length} events this week. Tap a day to focus.`}
          </p>
        </GlassCard>

        <div className="space-y-3">
          <h3 className="text-sm text-muted-foreground px-1">{weekDayLabels[selectedDay]}'s Events</h3>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : todayEvents.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">No events scheduled</p>
              <Button onClick={openCreate} className="mt-3 bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-1" /> Add event
              </Button>
            </GlassCard>
          ) : (
            todayEvents.map((event) => (
              <GlassCard key={event.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-1 self-stretch ${event.color} rounded-full`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4>{event.title}</h4>
                      <div className="flex items-center gap-1">
                        <StatusBadge variant="info">{event.event_type}</StatusBadge>
                        <button onClick={() => openEdit(event)} className="p-1.5 rounded-md hover:bg-white/40"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => remove(event.id)} className="p-1.5 rounded-md hover:bg-alert/10 text-alert"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {new Date(event.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {new Date(event.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" /> {event.location}
                        </div>
                      )}
                    </div>
                    {event.attendees.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div className="flex -space-x-2">
                          {event.attendees.slice(0, 3).map((name, idx) => (
                            <Avatar key={idx} className="w-6 h-6 border-2 border-white">
                              <AvatarFallback className="text-xs bg-primary text-primary-foreground">{name[0]}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        {event.attendees.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{event.attendees.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit event" : "New event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
            <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Starts</Label><Input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></div>
              <div><Label>Ends</Label><Input type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} /></div>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.event_type} onValueChange={(v) => setForm({ ...form, event_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Attendees (comma separated)</Label><Input value={form.attendees} onChange={(e) => setForm({ ...form, attendees: e.target.value })} placeholder="Sarah, Mike" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save} className="bg-primary text-primary-foreground">{editing ? "Save changes" : "Create event"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}