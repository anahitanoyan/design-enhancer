import { Check, Clock, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TaskCardProps {
  title: string;
  assignee: { name: string; avatar?: string };
  dueDate: string;
  priority: "low" | "medium" | "high";
  category: string;
  completed?: boolean;
  onClick?: () => void;
}

export function TaskCard({ title, assignee, dueDate, priority, category, completed = false, onClick }: TaskCardProps) {
  const priorityColor = {
    low: "bg-success/20 text-success",
    medium: "bg-warning/20 text-warning",
    high: "bg-alert/20 text-alert"
  };

  return (
    <div
      onClick={onClick}
      className={`glass-card p-4 cursor-pointer hover:shadow-lg transition-all ${completed ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className={`flex-1 ${completed ? 'line-through text-muted-foreground' : ''}`}>{title}</h4>
        {completed && <Check className="w-5 h-5 text-success" />}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Avatar className="w-6 h-6">
          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
            {assignee.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">{assignee.name}</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColor[priority]}`}>
          {priority}
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
          {category}
        </span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
          <Clock className="w-3 h-3" />
          {dueDate}
        </div>
      </div>
    </div>
  );
}
