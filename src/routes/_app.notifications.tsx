import { createFileRoute } from "@tanstack/react-router";
import { DetailedNotificationsScreen } from "@/screens/DetailedNotificationsScreen";
import { useScreenNav } from "@/lib/screen-nav";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — OikOS" },
      { name: "description", content: "Context-aware reminders and family alerts." },
      { property: "og:title", content: "Notifications — OikOS" },
      { property: "og:description", content: "Context-aware reminders." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { onBack } = useScreenNav();
  return <DetailedNotificationsScreen onBack={onBack} />;
}