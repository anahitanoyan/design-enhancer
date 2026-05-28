import { ReactNode } from "react";

interface StatusBadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "alert" | "info";
  icon?: ReactNode;
}

export function StatusBadge({ children, variant = "info", icon }: StatusBadgeProps) {
  const variants = {
    success: "bg-success/20 text-success border-success/30",
    warning: "bg-warning/20 text-warning border-warning/30",
    alert: "bg-alert/20 text-alert border-alert/30",
    info: "bg-accent/20 text-accent border-accent/30"
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {icon}
      {children}
    </div>
  );
}
