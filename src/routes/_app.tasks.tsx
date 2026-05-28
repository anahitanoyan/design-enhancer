import { createFileRoute } from "@tanstack/react-router";
import { DetailedTaskScreen } from "@/screens/DetailedTaskScreen";
import { useScreenNav } from "@/lib/screen-nav";

export const Route = createFileRoute("/_app/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — OikOS" },
      { name: "description", content: "AI-optimized task assignments for your household." },
      { property: "og:title", content: "Tasks — OikOS" },
      { property: "og:description", content: "AI-optimized household tasks." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const { onBack } = useScreenNav();
  return <DetailedTaskScreen onBack={onBack} />;
}