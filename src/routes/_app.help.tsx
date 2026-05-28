import { createFileRoute } from "@tanstack/react-router";
import { HelpScreen } from "@/screens/HelpScreen";
import { useScreenNav } from "@/lib/screen-nav";

export const Route = createFileRoute("/_app/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — OikOS" },
      { name: "description", content: "Get help with OikOS, browse FAQs, and contact support." },
    ],
  }),
  component: () => {
    const { onBack, onNavigate } = useScreenNav();
    return <HelpScreen onBack={onBack} onNavigate={onNavigate} />;
  },
});