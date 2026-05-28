import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsDashboard } from "@/screens/AnalyticsDashboard";
import { useScreenNav } from "@/lib/screen-nav";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — OikOS" },
      { name: "description", content: "Household insights, productivity trends and AI metrics." },
      { property: "og:title", content: "Analytics — OikOS" },
      { property: "og:description", content: "Household insights and trends." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { onBack } = useScreenNav();
  return <AnalyticsDashboard onBack={onBack} />;
}