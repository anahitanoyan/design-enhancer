import { Home, Calendar, CheckSquare, ShoppingCart, Bell, Users, TrendingUp, User, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { Logo } from "@/components/brand/Logo";
import mascotUrl from "@/assets/oikos-mascot.png";
import { useAuth, getUserInitials } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePrefs } from "@/lib/i18n";

interface WebSidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function WebSidebar({ currentScreen, onNavigate }: WebSidebarProps) {
  const { user } = useAuth();
  const { t } = usePrefs();
  const name = (user?.user_metadata?.display_name as string) || user?.email?.split("@")[0] || "Member";
  const initials = getUserInitials(name, user?.email);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else toast.success("Signed out");
  };

  const navItems: Array<{ id: string; label: string; icon: typeof Home | null; color: string; mascot?: boolean }> = [
    { id: "home", label: t("dashboard"), icon: Home, color: "text-primary" },
    { id: "ai", label: t("ai_assistant"), icon: null, color: "text-accent", mascot: true },
    { id: "schedule", label: t("schedule"), icon: Calendar, color: "text-primary" },
    { id: "tasks", label: t("tasks"), icon: CheckSquare, color: "text-primary" },
    { id: "grocery", label: t("grocery"), icon: ShoppingCart, color: "text-primary" },
    { id: "notifications", label: t("notifications"), icon: Bell, color: "text-primary" },
    { id: "family", label: t("family"), icon: Users, color: "text-primary" },
    { id: "analytics", label: t("analytics"), icon: TrendingUp, color: "text-primary" },
    { id: "settings", label: t("profile"), icon: User, color: "text-primary" }
  ];

  return (
    <div className="glass-card h-screen w-64 p-6 flex flex-col rounded-none border-r border-border">
      <div className="mb-8">
        <Logo tagline="AI Household OS" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'hover:bg-white/30 text-foreground'
              }`}
            >
              {item.mascot ? (
                <img src={mascotUrl} alt="" className="w-6 h-6 drop-shadow-sm" />
              ) : (
                Icon && <Icon className={`w-5 h-5 ${isActive ? '' : item.color}`} />
              )}
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="pt-6 border-t border-border space-y-2">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/30">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{name}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-alert/10 hover:text-alert transition"
        >
          <LogOut className="w-4 h-4" /> {t("sign_out")}
        </button>
      </div>
    </div>
  );
}
