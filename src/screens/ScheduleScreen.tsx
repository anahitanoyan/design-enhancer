import { ArrowLeft, Plus, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/oikos/GlassCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

export function ScheduleScreen({ onBack }: { onBack: () => void }) {
  const [currentWeek, setCurrentWeek] = useState(0);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekDates = [19, 20, 21, 22, 23, 24, 25];

  const events = [
    { day: 2, time: "9:00 AM", title: "Team Meeting", attendee: "John", color: "bg-primary" },
    { day: 2, time: "12:30 PM", title: "Lunch", attendee: "Jane", color: "bg-secondary" },
    { day: 2, time: "4:00 PM", title: "Soccer", attendee: "Sarah", color: "bg-accent" },
    { day: 3, time: "10:00 AM", title: "Doctor Appointment", attendee: "Mike", color: "bg-warning" },
    { day: 4, time: "3:00 PM", title: "Piano Lesson", attendee: "Sarah", color: "bg-success" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Calendar className="w-6 h-6 text-primary" />
        <h2>Schedule</h2>
        <button className="ml-auto p-2 rounded-full bg-primary text-primary-foreground">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <div className="glass-card p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentWeek(currentWeek - 1)}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h3>April 2026</h3>
            <button onClick={() => setCurrentWeek(currentWeek + 1)}>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, idx) => {
              const isToday = idx === 2;
              const dayEvents = events.filter(e => e.day === idx);

              return (
                <div key={idx} className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">{day}</div>
                  <div
                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm ${
                      isToday ? 'bg-primary text-primary-foreground' : 'hover:bg-white/30'
                    }`}
                  >
                    {weekDates[idx]}
                  </div>
                  {dayEvents.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-1">
                      {dayEvents.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-accent" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm text-muted-foreground">Today's Events</h3>

          {events
            .filter(e => e.day === 2)
            .map((event, idx) => (
              <GlassCard key={idx} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-1 h-full ${event.color} rounded-full`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4>{event.title}</h4>
                      <span className="text-xs text-muted-foreground">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {event.attendee[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{event.attendee}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
        </div>
      </div>
    </div>
  );
}
