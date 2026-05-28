import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { BottomNav } from "@/components/navigation/BottomNav";
import { WebSidebar } from "@/components/navigation/WebSidebar";
import { useScreenNav } from "@/lib/screen-nav";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { currentScreen, onNavigate } = useScreenNav();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", replace: true });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-app-gradient">
      <div className="hidden md:block">
        <WebSidebar currentScreen={currentScreen} onNavigate={onNavigate} />
      </div>
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
      <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}