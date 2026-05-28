import { ArrowLeft, Bell } from "lucide-react";
import { NotificationCard } from "../oikos/NotificationCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const notifications = {
    urgent: [
      {
        id: "1",
        title: "Schedule Conflict Detected",
        message: "Soccer practice overlaps with dentist appointment on Monday at 3pm",
        type: "alert" as const,
        time: "5 min ago",
        urgent: true
      }
    ],
    today: [
      {
        id: "2",
        title: "Task Completed",
        message: "John completed 'Grocery shopping'",
        type: "success" as const,
        time: "2 hours ago"
      },
      {
        id: "3",
        title: "Meal Plan Ready",
        message: "Your weekly meal plan has been generated",
        type: "info" as const,
        time: "4 hours ago"
      }
    ],
    earlier: [
      {
        id: "4",
        title: "Calendar Synced",
        message: "Successfully synced with Google Calendar",
        type: "success" as const,
        time: "Yesterday"
      },
      {
        id: "5",
        title: "New Family Member",
        message: "Mike Doe joined your household",
        type: "info" as const,
        time: "2 days ago"
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Bell className="w-6 h-6 text-primary" />
        <h2>Notifications</h2>
      </div>

      <div className="p-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="glass-card w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="all">
              All ({notifications.urgent.length + notifications.today.length + notifications.earlier.length})
            </TabsTrigger>
            <TabsTrigger value="urgent">
              Urgent ({notifications.urgent.length})
            </TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.urgent.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm text-muted-foreground">Urgent</h3>
                {notifications.urgent.map(notif => (
                  <NotificationCard key={notif.id} {...notif} />
                ))}
              </div>
            )}

            {notifications.today.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm text-muted-foreground">Today</h3>
                {notifications.today.map(notif => (
                  <NotificationCard key={notif.id} {...notif} />
                ))}
              </div>
            )}

            {notifications.earlier.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm text-muted-foreground">Earlier</h3>
                {notifications.earlier.map(notif => (
                  <NotificationCard key={notif.id} {...notif} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="urgent" className="space-y-3">
            {notifications.urgent.map(notif => (
              <NotificationCard key={notif.id} {...notif} />
            ))}
          </TabsContent>

          <TabsContent value="read">
            <p className="text-center text-muted-foreground py-8">No read notifications</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
