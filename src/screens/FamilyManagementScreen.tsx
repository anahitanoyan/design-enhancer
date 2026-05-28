import { ArrowLeft, Users, Plus, Mail, Phone, Calendar, CheckSquare, Crown, Shield, User as UserIcon, MoreVertical, Edit, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/oikos/GlassCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/oikos/StatusBadge";
import { Separator } from "@/components/ui/separator";

export function FamilyManagementScreen({ onBack }: { onBack: () => void }) {
  const familyMembers = [
    {
      id: "1",
      name: "John Doe",
      role: "Admin",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      status: "active" as const,
      joinedDate: "January 2026",
      tasksCompleted: 45,
      eventsThisWeek: 8,
      avatar: "JD",
      permissions: ["full_access", "manage_members", "ai_settings"]
    },
    {
      id: "2",
      name: "Jane Doe",
      role: "Member",
      email: "jane.doe@example.com",
      phone: "+1 (555) 123-4568",
      status: "active" as const,
      joinedDate: "January 2026",
      tasksCompleted: 38,
      eventsThisWeek: 6,
      avatar: "JD",
      permissions: ["view_all", "edit_own"]
    },
    {
      id: "3",
      name: "Sarah Doe",
      role: "Child",
      email: "sarah.doe@example.com",
      phone: "",
      status: "away" as const,
      joinedDate: "January 2026",
      tasksCompleted: 22,
      eventsThisWeek: 5,
      avatar: "SD",
      permissions: ["view_own", "edit_own"]
    },
    {
      id: "4",
      name: "Mike Doe",
      role: "Child",
      email: "mike.doe@example.com",
      phone: "",
      status: "active" as const,
      joinedDate: "January 2026",
      tasksCompleted: 18,
      eventsThisWeek: 3,
      avatar: "MD",
      permissions: ["view_own", "edit_own"]
    }
  ];

  const statusColors = {
    active: "bg-success",
    away: "bg-warning",
    offline: "bg-muted"
  };

  const roleIcons = {
    Admin: Crown,
    Member: Shield,
    Child: UserIcon
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF5F0] via-[#E8F4F8] to-[#F0F8FF]">
      {/* Header */}
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Users className="w-6 h-6 text-primary" />
        <h2>Family Members</h2>
        <button className="ml-auto p-2 rounded-full bg-primary text-primary-foreground">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24 space-y-4">
        {/* Family Overview */}
        <GlassCard className="p-5">
          <h3 className="mb-4">Household Overview</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-white/30">
              <div className="text-2xl font-semibold text-primary mb-1">{familyMembers.length}</div>
              <div className="text-xs text-muted-foreground">Members</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/30">
              <div className="text-2xl font-semibold text-success mb-1">
                {familyMembers.reduce((sum, m) => sum + m.tasksCompleted, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Tasks Done</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/30">
              <div className="text-2xl font-semibold text-accent mb-1">
                {familyMembers.reduce((sum, m) => sum + m.eventsThisWeek, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Events</div>
            </div>
          </div>
        </GlassCard>

        {/* Members List */}
        <div className="space-y-3">
          {familyMembers.map((member) => {
            const RoleIcon = roleIcons[member.role as keyof typeof roleIcons];

            return (
              <GlassCard key={member.id} className="p-0 overflow-hidden">
                {/* Member Header */}
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="relative">
                      <Avatar className="w-14 h-14">
                        <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${statusColors[member.status]}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg">{member.name}</h3>
                        <RoleIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <StatusBadge variant={member.role === "Admin" ? "warning" : "info"}>
                          {member.role}
                        </StatusBadge>
                        <span className="text-xs text-muted-foreground">
                          Joined {member.joinedDate}
                        </span>
                      </div>
                    </div>

                    <button className="p-2">
                      <MoreVertical className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/30">
                      <CheckSquare className="w-4 h-4 text-success" />
                      <div>
                        <div className="text-sm font-medium">{member.tasksCompleted}</div>
                        <div className="text-xs text-muted-foreground">Tasks</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/30">
                      <Calendar className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-sm font-medium">{member.eventsThisWeek}</div>
                        <div className="text-xs text-muted-foreground">Events</div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  {member.email && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Mail className="w-3 h-3" />
                      {member.email}
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {member.phone}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Permissions */}
                <div className="p-4 bg-white/20">
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Permissions</h4>
                  <div className="flex gap-1.5 flex-wrap">
                    {member.permissions.map((permission, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded-full bg-white/50 text-foreground">
                        {permission.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="p-3 flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/30 hover:bg-white/50 transition-colors">
                    <Edit className="w-4 h-4" />
                    <span className="text-sm">Edit</span>
                  </button>
                  {member.role !== "Admin" && (
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-alert/20 hover:bg-alert/30 text-alert transition-colors">
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Remove</span>
                    </button>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Invite New Member */}
        <GlassCard className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h3 className="mb-2">Invite Family Member</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add new members to your household and collaborate together
          </p>
          <button className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-secondary transition-colors">
            Send Invitation
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
