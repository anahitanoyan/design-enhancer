import { Home, Calendar, CheckSquare, User } from "lucide-react";
import mascotUrl from "@/assets/oikos-mascot.png";
import { usePrefs } from "@/lib/i18n";

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const { t } = usePrefs();
  const navItems: Array<{ id: string; label: string; icon: typeof Home | null; mascot?: boolean }> = [
    { id: "home", label: t("dashboard"), icon: Home },
    { id: "schedule", label: t("schedule"), icon: Calendar },
    { id: "ai", label: t("ai_assistant"), icon: null, mascot: true },
    { id: "tasks", label: t("tasks"), icon: CheckSquare },
    { id: "settings", label: t("profile"), icon: User }
  ];

  return (
    <div className="glass-card fixed bottom-0 left-0 right-0 rounded-none md:hidden">
      <div className="flex items-center justify-around p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className={`p-2 rounded-xl ${isActive ? 'bg-primary/10' : ''}`}>
                {item.mascot ? (
                  <img src={mascotUrl} alt="" className="w-6 h-6 drop-shadow-sm" />
                ) : (
                  Icon && <Icon className="w-5 h-5" />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
