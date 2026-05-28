import { createFileRoute } from "@tanstack/react-router";
import { AIChat } from "@/screens/AIChat";
import { useScreenNav } from "@/lib/screen-nav";

export const Route = createFileRoute("/_app/ai")({
  head: () => ({
    meta: [
      { title: "AI Assistant — OikOS" },
      { name: "description", content: "Chat with the OikOS AI agents to coordinate your household." },
      { property: "og:title", content: "AI Assistant — OikOS" },
      { property: "og:description", content: "Talk to the OikOS AI agents." },
    ],
  }),
  component: AIPage,
});

function AIPage() {
  const { onBack } = useScreenNav();
  return <AIChat onBack={onBack} />;
}