import { useNavigate, useRouterState } from "@tanstack/react-router";

const screenToPath: Record<string, string> = {
  home: "/dashboard",
  ai: "/ai",
  schedule: "/schedule",
  tasks: "/tasks",
  grocery: "/grocery",
  notifications: "/notifications",
  analytics: "/analytics",
  family: "/family",
  settings: "/settings",
  billing: "/billing",
  help: "/help",
};

const pathToScreen: Record<string, string> = Object.fromEntries(
  Object.entries(screenToPath).map(([k, v]) => [v, k]),
);

export function useScreenNav() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const currentScreen = pathToScreen[pathname] ?? "home";

  const onNavigate = (screen: string) => {
    const path = screenToPath[screen] ?? "/dashboard";
    navigate({ to: path });
  };
  const onBack = () => navigate({ to: "/dashboard" });

  return { currentScreen, onNavigate, onBack };
}