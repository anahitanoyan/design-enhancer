import { Bell, AlertCircle, CheckCircle, Info } from "lucide-react";

interface NotificationCardProps {
  title: string;
  message: string;
  type: "alert" | "success" | "info";
  time: string;
  urgent?: boolean;
}

export function NotificationCard({ title, message, type, time, urgent = false }: NotificationCardProps) {
  const icons = {
    alert: <AlertCircle className="w-5 h-5 text-alert" />,
    success: <CheckCircle className="w-5 h-5 text-success" />,
    info: <Info className="w-5 h-5 text-accent" />
  };

  return (
    <div className={`glass-card p-4 ${urgent ? 'border-l-4 border-alert' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icons[type]}</div>
        <div className="flex-1">
          <h4 className="mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground mb-2">{message}</p>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
      </div>
    </div>
  );
}
