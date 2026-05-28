import { createFileRoute } from "@tanstack/react-router";
import { EnhancedHomeDashboard } from "@/screens/EnhancedHomeDashboard";
import { EnhancedWebDashboard } from "@/screens/EnhancedWebDashboard";
import { useScreenNav } from "@/lib/screen-nav";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — OikOS" },
      { name: "description", content: "Your AI-powered household overview: schedule, tasks, grocery, family." },
      { property: "og:title", content: "Dashboard — OikOS" },
      { property: "og:description", content: "Your AI-powered household overview." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { onNavigate } = useScreenNav();
  return (
    <>
      <div className="md:hidden">
        <EnhancedHomeDashboard onNavigate={onNavigate} />
      </div>
      <div className="hidden md:block">
        <EnhancedWebDashboard />
      </div>
    </>
  );
}