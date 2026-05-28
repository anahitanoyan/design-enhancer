import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNav } from "@/components/navigation/BottomNav";
import { WebSidebar } from "@/components/navigation/WebSidebar";
import { useScreenNav } from "@/lib/screen-nav";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { currentScreen, onNavigate } = useScreenNav();

  return (
    <div className="flex min-h-screen w-full">
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