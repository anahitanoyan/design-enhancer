import { ArrowLeft, User, Bell, Lock, Palette, Globe, HelpCircle, LogOut, ChevronRight, Shield, CreditCard, Users, Sparkles, TrendingUp, Plus } from "lucide-react";
import { GlassCard } from "../oikos/GlassCard";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";

export function UserProfileScreen({ onBack, onNavigate }: { onBack: () => void; onNavigate?: (screen: string) => void }) {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    avatar: "JD",
    memberSince: "January 2026"
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF5F0] via-[#E8F4F8] to-[#F0F8FF]">
      {/* Header */}
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <User className="w-6 h-6 text-primary" />
        <h2>Profile & Settings</h2>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24 space-y-4">
        {/* Profile Header */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-secondary text-white">
                {user.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl mb-1">{user.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{user.email}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                  {user.role}
                </span>
                <span className="text-xs text-muted-foreground">
                  Member since {user.memberSince}
                </span>
              </div>
            </div>
          </div>

          <button className="w-full py-2 rounded-xl border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
            Edit Profile
          </button>
        </GlassCard>

        {/* AI Agents Configuration */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 pb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3>AI Agents</h3>
          </div>
          <Separator />

          <div className="divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Coordinator Agent</h4>
                  <p className="text-xs text-muted-foreground">Schedule & conflict management</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-secondary to-accent">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Task Agent</h4>
                  <p className="text-xs text-muted-foreground">Task assignment & tracking</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-accent to-primary">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Reminder Agent</h4>
                  <p className="text-xs text-muted-foreground">Smart notifications</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-secondary to-primary">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Grocery Agent</h4>
                  <p className="text-xs text-muted-foreground">Shopping intelligence</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </GlassCard>

        {/* Notifications */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 pb-3 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3>Notifications</h3>
          </div>
          <Separator />

          <div className="divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Push Notifications</h4>
                <p className="text-xs text-muted-foreground">Receive real-time updates</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Email Notifications</h4>
                <p className="text-xs text-muted-foreground">Daily digest emails</p>
              </div>
              <Switch />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Task Reminders</h4>
                <p className="text-xs text-muted-foreground">Get reminded about tasks</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Schedule Alerts</h4>
                <p className="text-xs text-muted-foreground">Event notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </GlassCard>

        {/* Household */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 pb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3>Household</h3>
          </div>
          <Separator />

          <button
            onClick={() => onNavigate?.('family')}
            className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <h4 className="text-sm font-medium">Family Members</h4>
                <p className="text-xs text-muted-foreground">Manage household members</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <Separator />

          <button className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <h4 className="text-sm font-medium">Roles & Permissions</h4>
                <p className="text-xs text-muted-foreground">Control access levels</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </GlassCard>

        {/* Analytics */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 pb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3>Insights</h3>
          </div>
          <Separator />

          <button
            onClick={() => onNavigate?.('analytics')}
            className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <h4 className="text-sm font-medium">Analytics Dashboard</h4>
                <p className="text-xs text-muted-foreground">View productivity & stats</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </GlassCard>

        {/* Preferences */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 pb-3">
            <h3>Preferences</h3>
          </div>
          <Separator />

          <button className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">Appearance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Light</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>

          <Separator />

          <button className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">Language</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">English</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>

          <Separator />

          <button className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">Privacy & Security</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </GlassCard>

        {/* Connected Services */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 pb-3">
            <h3>Connected Services</h3>
          </div>
          <Separator />

          <div className="p-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Google Calendar</h4>
              <p className="text-xs text-success">Connected</p>
            </div>
            <button className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-alert hover:text-white transition-colors">
              Disconnect
            </button>
          </div>

          <Separator />

          <button className="w-full p-4 hover:bg-white/30 transition-colors">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Service</span>
            </div>
          </button>
        </GlassCard>

        {/* Account */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 pb-3">
            <h3>Account</h3>
          </div>
          <Separator />

          <button className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">Billing & Subscription</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <Separator />

          <button className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">Help & Support</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </GlassCard>

        {/* Sign Out */}
        <button className="w-full glass-card p-4 flex items-center justify-center gap-2 text-alert hover:bg-alert/10 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>

        {/* App Info */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>OikOS v1.0.0</p>
          <p>© 2026 OikOS. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
