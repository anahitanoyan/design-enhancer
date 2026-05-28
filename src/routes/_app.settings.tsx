import { createFileRoute } from "@tanstack/react-router";
import { UserProfileScreen } from "@/screens/UserProfileScreen";
import { useScreenNav } from "@/lib/screen-nav";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Profile — OikOS" },
      { name: "description", content: "Your OikOS profile, preferences and integrations." },
      { property: "og:title", content: "Profile — OikOS" },
      { property: "og:description", content: "Your OikOS profile and preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { onBack, onNavigate } = useScreenNav();
  return <UserProfileScreen onBack={onBack} onNavigate={onNavigate} />;
}