import { createFileRoute } from "@tanstack/react-router";
import { FamilyManagementScreen } from "@/screens/FamilyManagementScreen";
import { useScreenNav } from "@/lib/screen-nav";

export const Route = createFileRoute("/_app/family")({
  head: () => ({
    meta: [
      { title: "Family — OikOS" },
      { name: "description", content: "Manage family members, roles and collaboration." },
      { property: "og:title", content: "Family — OikOS" },
      { property: "og:description", content: "Manage your household members." },
    ],
  }),
  component: FamilyPage,
});

function FamilyPage() {
  const { onBack } = useScreenNav();
  return <FamilyManagementScreen onBack={onBack} />;
}