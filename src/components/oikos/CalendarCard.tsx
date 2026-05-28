import { Calendar as CalendarIcon, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  attendees: string[];
  color?: string;
}

interface CalendarCardProps {
  date: string;
  events: CalendarEvent[];
}

export function CalendarCard({ date, events }: CalendarCardProps) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <CalendarIcon className="w-5 h-5 text-primary" />
        <h3>{date}</h3>
      </div>

      <div className="space-y-3">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No events today</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="p-3 rounded-lg bg-white/50 border border-white/30 hover:bg-white/70 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm flex-1">{event.title}</h4>
                <span className="text-xs text-muted-foreground">{event.time}</span>
              </div>

              {event.attendees.length > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <div className="flex -space-x-2">
                    {event.attendees.slice(0, 3).map((name, idx) => (
                      <Avatar key={idx} className="w-5 h-5 border-2 border-white">
                        <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                          {name[0]}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  {event.attendees.length > 3 && (
                    <span className="text-xs text-muted-foreground ml-1">
                      +{event.attendees.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
