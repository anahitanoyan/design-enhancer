import { ArrowLeft, Settings, Users, Bell, Calendar, Sparkles, LogOut } from "lucide-react";
import { GlassCard } from "../oikos/GlassCard";
import { FamilyMembersCard } from "../oikos/FamilyMembersCard";
import { Switch } from "../ui/switch";

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const familyMembers = [
    { id: "1", name: "John Doe", role: "Parent", status: "active" as const },
    { id: "2", name: "Jane Doe", role: "Parent", status: "active" as const },
    { id: "3", name: "Sarah Doe", role: "Child", status: "away" as const },
    { id: "4", name: "Mike Doe", role: "Child", status: "active" as const }
  ];

  return (
    <div className="min-h-screen">
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Settings className="w-6 h-6 text-primary" />
        <h2>Settings</h2>
      </div>

      <div className="p-4 space-y-4">
        <FamilyMembersCard members={familyMembers} />

        <GlassCard className="p-0 overflow-hidden">
          <h3 className="p-4 pb-3">AI Agents</h3>

          <div className="divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-br from-primary to-secondary">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm">Coordinator Agent</h4>
                  <p className="text-xs text-muted-foreground">Manages schedules & conflicts</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-br from-secondary to-accent">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm">Task Agent</h4>
                  <p className="text-xs text-muted-foreground">Assigns & tracks tasks</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-br from-accent to-primary">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm">Reminder Agent</h4>
                  <p className="text-xs text-muted-foreground">Smart notifications</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-br from-secondary to-primary">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm">Grocery Agent</h4>
                  <p className="text-xs text-muted-foreground">Shopping planning</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-0 overflow-hidden">
          <h3 className="p-4 pb-3">Notifications</h3>

          <div className="divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <span className="text-sm">Push Notifications</span>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <span className="text-sm">Email Digests</span>
              </div>
              <Switch />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-0 overflow-hidden">
          <h3 className="p-4 pb-3">Connected Services</h3>

          <div className="divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="text-sm">Google Calendar</h4>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
              <button className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                Disconnect
              </button>
            </div>
          </div>
        </GlassCard>

        <button className="w-full glass-card p-4 flex items-center justify-center gap-2 text-alert hover:bg-alert/10 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
