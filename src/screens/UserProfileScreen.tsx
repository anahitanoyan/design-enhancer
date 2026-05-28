import { ArrowLeft, User, Bell, Lock, Palette, Globe, HelpCircle, LogOut, ChevronRight, Shield, CreditCard, Users, Sparkles, TrendingUp, Plus, Loader2, Phone } from "lucide-react";
import { GlassCard } from "@/components/oikos/GlassCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth, getUserInitials } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { usePrefs, type Lang, type Theme } from "@/lib/i18n";

export function UserProfileScreen({ onBack, onNavigate }: { onBack: () => void; onNavigate?: (screen: string) => void }) {
  const { user } = useAuth();
  const { lang, setLang, theme, setTheme, t } = usePrefs();
  const defaultName = (user?.user_metadata?.display_name as string) || user?.email?.split("@")[0] || "Member";
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("Admin");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const initials = getUserInitials(name, user?.email);
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "—";

  useEffect(() => {
    if (!user?.id) return;
    (supabase.from("profiles") as any)
      .select("display_name, phone, bio, role")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }: any) => {
        if (!data) return;
        if (data.display_name) setName(data.display_name);
        setPhone(data.phone ?? "");
        setBio(data.bio ?? "");
        setRole(data.role ?? "Admin");
      });
  }, [user?.id]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { display_name: name } });
    if (error) {
      setSaving(false);
      toast.error(error.message);
      return;
    }
    const { error: pErr } = await (supabase.from("profiles") as any)
      .update({ display_name: name, phone, bio, role })
      .eq("id", user?.id ?? "");
    setSaving(false);
    if (pErr) toast.error(pErr.message);
    else {
      toast.success("Profile updated");
      setEditing(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else toast.success("Signed out");
  };

  return (
    <div className="min-h-screen flex flex-col bg-app-gradient">
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
              <AvatarFallback className="text-2xl bg-gradient-to-br from-[#FF7E9D] to-[#7AB8E0] text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {editing ? (
                <div className="space-y-2">
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short bio" rows={2} />
                </div>
              ) : (
                <>
                  <h3 className="text-xl mb-1">{name}</h3>
                  {phone && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                      <Phone className="w-3 h-3" /> {phone}
                    </p>
                  )}
                  {bio && <p className="text-xs text-muted-foreground mb-1">{bio}</p>}
                </>
              )}
              <p className="text-sm text-muted-foreground mb-1">{user?.email}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                  {role}
                </span>
                <span className="text-xs text-muted-foreground">
                  Member since {memberSince}
                </span>
              </div>
            </div>
          </div>

          {editing ? (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1 bg-gradient-to-r from-[#FF7E9D] to-[#7AB8E0] text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
              <Button variant="outline" onClick={() => { setName(defaultName); setEditing(false); }}>Cancel</Button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="w-full py-2 rounded-xl border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
              Edit Profile
            </button>
          )}
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

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">{t("theme")}</span>
            </div>
            <Select value={theme} onValueChange={(v) => setTheme(v as Theme)}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t("light")}</SelectItem>
                <SelectItem value="dark">{t("dark")}</SelectItem>
                <SelectItem value="system">{t("system")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">{t("language")}</span>
            </div>
            <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="hy">Հայերեն</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

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

          <button
            onClick={() => onNavigate?.("billing")}
            className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">{t("billing")}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <Separator />

          <button
            onClick={() => onNavigate?.("help")}
            className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">{t("help")}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </GlassCard>

        {/* Sign Out */}
        <button onClick={handleSignOut} className="w-full glass-card p-4 flex items-center justify-center gap-2 text-alert hover:bg-alert/10 transition-colors">
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
