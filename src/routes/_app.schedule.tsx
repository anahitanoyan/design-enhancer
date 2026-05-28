import { createFileRoute } from "@tanstack/react-router";
import { DetailedScheduleScreen } from "@/screens/DetailedScheduleScreen";
import { useScreenNav } from "@/lib/screen-nav";

export const Route = createFileRoute("/_app/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule — OikOS" },
      { name: "description", content: "Smart family calendar with automatic conflict resolution." },
      { property: "og:title", content: "Schedule — OikOS" },
      { property: "og:description", content: "Smart family calendar." },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  const { onBack } = useScreenNav();
  return <DetailedScheduleScreen onBack={onBack} />;
}