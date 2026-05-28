import { ArrowLeft, Plus, Calendar, ChevronLeft, ChevronRight, Filter, Clock, MapPin, Users, Sparkles } from "lucide-react";
import { GlassCard } from "../oikos/GlassCard";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { StatusBadge } from "../oikos/StatusBadge";
import { ConflictResolutionCard } from "../oikos/ConflictResolutionCard";
import { useState } from "react";

export function DetailedScheduleScreen({ onBack }: { onBack: () => void }) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(2);
  const [viewMode, setViewMode] = useState<"week" | "day" | "month">("week");

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekDates = [19, 20, 21, 22, 23, 24, 25];

  const events = [
    {
      id: "1",
      day: 2,
      time: "9:00 AM",
      endTime: "10:00 AM",
      title: "Team Meeting",
      attendees: ["John", "Sarah"],
      color: "bg-primary",
      location: "Office",
      type: "work"
    },
    {
      id: "2",
      day: 2,
      time: "12:30 PM",
      endTime: "1:30 PM",
      title: "Lunch with Family",
      attendees: ["Mom", "Dad", "Sister"],
      color: "bg-secondary",
      location: "Home",
      type: "personal"
    },
    {
      id: "3",
      day: 2,
      time: "4:00 PM",
      endTime: "5:30 PM",
      title: "Soccer Practice",
      attendees: ["Coach", "Team"],
      color: "bg-accent",
      location: "Sports Center",
      type: "activity"
    },
    {
      id: "4",
      day: 3,
      time: "10:00 AM",
      endTime: "11:00 AM",
      title: "Doctor Appointment",
      attendees: ["Mike", "Mom"],
      color: "bg-warning",
      location: "Medical Center",
      type: "health"
    },
    {
      id: "5",
      day: 4,
      time: "3:00 PM",
      endTime: "4:00 PM",
      title: "Piano Lesson",
      attendees: ["Sarah"],
      color: "bg-success",
      location: "Music School",
      type: "activity"
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

  const getDayEvents = (day: number) => events.filter(e => e.day === day);
  const todayEvents = getDayEvents(selectedDay);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF5F0] via-[#E8F4F8] to-[#F0F8FF]">
      {/* Header */}
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Calendar className="w-6 h-6 text-primary" />
        <h2>Schedule</h2>
        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 rounded-xl bg-white/30 hover:bg-white/50 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full bg-primary text-primary-foreground">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24 space-y-4">
        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full">
          <TabsList className="glass-card w-full grid grid-cols-3">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>

          {/* Week View */}
          <TabsContent value="week" className="space-y-4">
            {/* Calendar Header */}
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentWeek(currentWeek - 1)}>
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="text-center">
                  <h3>April 2026</h3>
                  <p className="text-xs text-muted-foreground">Week 16</p>
                </div>
                <button onClick={() => setCurrentWeek(currentWeek + 1)}>
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, idx) => {
                  const isToday = idx === 2;
                  const dayEvents = getDayEvents(idx);

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDay(idx)}
                      className="text-center"
                    >
                      <div className="text-xs text-muted-foreground mb-2">{day}</div>
                      <div
                        className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm transition-all ${
                          isToday
                            ? 'bg-primary text-primary-foreground'
                            : selectedDay === idx
                            ? 'bg-secondary text-secondary-foreground'
                            : 'hover:bg-white/30'
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
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* AI Insights */}
            <GlassCard gradient="mixed" className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <h4 className="text-sm font-medium">Schedule Insights</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Your busiest day is Wednesday with 5 events. I've optimized travel time between appointments.
              </p>
              <div className="flex gap-2 flex-wrap">
                <StatusBadge variant="info">15 hrs scheduled</StatusBadge>
                <StatusBadge variant="success">2 hrs free</StatusBadge>
              </div>
            </GlassCard>

            {/* Conflicts */}
            {conflict && (
              <ConflictResolutionCard
                conflict={conflict}
                onResolve={(id, solution) => console.log("Resolve:", id, solution)}
                onDismiss={(id) => console.log("Dismiss:", id)}
              />
            )}
          </TabsContent>

          {/* Day View */}
          <TabsContent value="day" className="space-y-3">
            <GlassCard className="p-4">
              <h3 className="mb-3">{weekDays[selectedDay]}, April {weekDates[selectedDay]}</h3>
              <div className="text-sm text-muted-foreground mb-4">
                {todayEvents.length} events scheduled
              </div>
            </GlassCard>
          </TabsContent>

          {/* Month View */}
          <TabsContent value="month" className="space-y-3">
            <GlassCard className="p-4">
              <h3 className="mb-3">April 2026</h3>
              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-muted-foreground">{d}</div>
                ))}
                {Array.from({ length: 30 }, (_, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg ${
                      i + 1 === 21 ? 'bg-primary text-primary-foreground' : 'hover:bg-white/30'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>

        {/* Today's Events */}
        <div className="space-y-3">
          <h3 className="text-sm text-muted-foreground px-1">
            {weekDays[selectedDay]}'s Events
          </h3>

          {todayEvents.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">No events scheduled</p>
            </GlassCard>
          ) : (
            todayEvents.map((event) => (
              <GlassCard key={event.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-1 h-full ${event.color} rounded-full`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4>{event.title}</h4>
                      <StatusBadge variant="info">{event.type}</StatusBadge>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {event.time} - {event.endTime}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div className="flex -space-x-2">
                        {event.attendees.slice(0, 3).map((name, idx) => (
                          <Avatar key={idx} className="w-6 h-6 border-2 border-white">
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                              {name[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      {event.attendees.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{event.attendees.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
