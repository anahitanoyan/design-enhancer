import { ArrowLeft, Users, Plus, Mail, Phone, Crown, Shield, User as UserIcon, Edit, Trash2, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/oikos/GlassCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/oikos/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

type Member = {
  id: string;
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
  status: string;
  joined_date: string;
  avatar_initials: string | null;
};

const ROLES = ["Admin", "Member", "Child", "Guest"];
const STATUSES = ["active", "away", "offline"];

const statusColors: Record<string, string> = {
  active: "bg-success",
  away: "bg-warning",
  offline: "bg-muted",
};

const roleIcons: Record<string, typeof Crown> = {
  Admin: Crown,
  Member: Shield,
  Child: UserIcon,
  Guest: UserIcon,
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function FamilyManagementScreen({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [saving, setSaving] = useState(false);

  // form
  const [name, setName] = useState("");
  const [role, setRole] = useState("Member");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("active");

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await (supabase.from("family_members") as any)
      .select("*")
      .order("created_at", { ascending: true });
    setLoading(false);
    if (error) toast.error(error.message);
    else setMembers((data ?? []) as Member[]);
  };

  useEffect(() => { load(); }, [user?.id]);

  const openAdd = () => {
    setEditing(null);
    setName(""); setRole("Member"); setEmail(""); setPhone(""); setStatus("active");
    setDialogOpen(true);
  };

  const openEdit = (m: Member) => {
    setEditing(m);
    setName(m.name);
    setRole(m.role);
    setEmail(m.email ?? "");
    setPhone(m.phone ?? "");
    setStatus(m.status);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    if (!name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    const payload = {
      owner_id: user.id,
      name: name.trim(),
      role,
      email: email.trim() || null,
      phone: phone.trim() || null,
      status,
      avatar_initials: initialsFromName(name),
    };
    const { error } = editing
      ? await (supabase.from("family_members") as any).update(payload).eq("id", editing.id)
      : await (supabase.from("family_members") as any).insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editing ? "Member updated" : "Member added");
    setDialogOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await (supabase.from("family_members") as any).delete().eq("id", deleteTarget.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Member removed");
      load();
    }
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-app-gradient">
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} aria-label="Back"><ArrowLeft className="w-6 h-6" /></button>
        <Users className="w-6 h-6 text-primary" />
        <h2>Family Members</h2>
        <button onClick={openAdd} aria-label="Add member" className="ml-auto p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24 space-y-4">
        <GlassCard className="p-5">
          <h3 className="mb-4">Household Overview</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-white/30">
              <div className="text-2xl font-semibold text-primary mb-1">{members.length}</div>
              <div className="text-xs text-muted-foreground">Members</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/30">
              <div className="text-2xl font-semibold text-success mb-1">{members.filter(m => m.status === "active").length}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/30">
              <div className="text-2xl font-semibold text-accent mb-1">{members.filter(m => m.role === "Admin").length}</div>
              <div className="text-xs text-muted-foreground">Admins</div>
            </div>
          </div>
        </GlassCard>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : members.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-2">No members yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Add the first member of your household.</p>
            <Button onClick={openAdd} className="bg-primary text-primary-foreground">Add Member</Button>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {members.map((m) => {
              const RoleIcon = roleIcons[m.role] ?? UserIcon;
              return (
                <GlassCard key={m.id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <Avatar className="w-14 h-14">
                        <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                          {m.avatar_initials ?? initialsFromName(m.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${statusColors[m.status] ?? "bg-muted"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg truncate">{m.name}</h3>
                        <RoleIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge variant={m.role === "Admin" ? "warning" : "info"}>{m.role}</StatusBadge>
                        <span className="text-xs text-muted-foreground">Joined {new Date(m.joined_date).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</span>
                      </div>
                      {m.email && <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><Mail className="w-3 h-3" />{m.email}</div>}
                      {m.phone && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="w-3 h-3" />{m.phone}</div>}
                    </div>
                  </div>
                  <Separator className="mb-3" />
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(m)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/40 hover:bg-white/60 transition-colors">
                      <Edit className="w-4 h-4" /><span className="text-sm">Edit</span>
                    </button>
                    <button onClick={() => setDeleteTarget(m)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-alert/20 hover:bg-alert/30 text-alert transition-colors">
                      <Trash2 className="w-4 h-4" /><span className="text-sm">Remove</span>
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit member" : "Add family member"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="m-name">Name</Label>
              <Input id="m-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-email">Email</Label>
              <Input id="m-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-phone">Phone</Label>
              <Input id="m-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? "Save changes" : "Add member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the member from your household.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-alert text-white hover:bg-alert/90">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}