import { Users } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  status: "active" | "away" | "offline";
}

interface FamilyMembersCardProps {
  members: FamilyMember[];
}

export function FamilyMembersCard({ members }: FamilyMembersCardProps) {
  const statusColors = {
    active: "bg-success",
    away: "bg-warning",
    offline: "bg-muted"
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h3>Family</h3>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusColors[member.status]}`} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm">{member.name}</h4>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
