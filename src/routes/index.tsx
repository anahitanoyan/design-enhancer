import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { OnboardingScreen } from "@/screens/OnboardingScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OikOS — AI Operating System for Household Life" },
      { name: "description", content: "OikOS is your AI-powered household command center for schedules, tasks, grocery lists, and family coordination." },
      { property: "og:title", content: "OikOS — AI Operating System for Household Life" },
      { property: "og:description", content: "Your AI-powered household command center." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("oikos.onboarded") === "true") {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [navigate]);

  const handleComplete = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("oikos.onboarded", "true");
    }
    navigate({ to: "/dashboard" });
  };

  return <OnboardingScreen onComplete={handleComplete} />;
}
