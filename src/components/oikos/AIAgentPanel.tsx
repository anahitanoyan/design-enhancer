import { Bot, Loader2, CheckCircle2, Brain, ListChecks, Bell, ShoppingBag } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { motion } from "motion/react";

interface AgentActivity {
  agent: "coordinator" | "task" | "reminder" | "grocery";
  status: "idle" | "working" | "completed" | "error";
  currentTask?: string;
  lastAction?: string;
  actionTime?: string;
}

interface AIAgentPanelProps {
  activities: AgentActivity[];
  compact?: boolean;
}

export function AIAgentPanel({ activities, compact = false }: AIAgentPanelProps) {
  const agentConfig = {
    coordinator: {
      name: "Coordinator",
      icon: Brain,
      gradient: "from-primary via-secondary to-primary",
      description: "Managing schedules & conflicts"
    },
    task: {
      name: "Task Agent",
      icon: ListChecks,
      gradient: "from-secondary via-accent to-secondary",
      description: "Organizing household tasks"
    },
    reminder: {
      name: "Reminder",
      icon: Bell,
      gradient: "from-accent via-primary to-accent",
      description: "Smart notifications"
    },
    grocery: {
      name: "Grocery",
      icon: ShoppingBag,
      gradient: "from-secondary via-primary to-secondary",
      description: "Shopping intelligence"
    }
  };

  const getStatusIcon = (status: AgentActivity["status"]) => {
    switch (status) {
      case "working":
        return <Loader2 className="w-4 h-4 text-white animate-spin" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-white" />;
      default:
        return <Bot className="w-4 h-4 text-white" />;
    }
  };

  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {activities.map((activity) => {
          const config = agentConfig[activity.agent];
          const Icon = config.icon;
          const isActive = activity.status === "working";

          return (
            <motion.div
              key={activity.agent}
              animate={isActive ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: isActive ? Infinity : 0, duration: 2 }}
              className="relative flex-shrink-0"
            >
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${config.gradient} relative`}>
                <Icon className="w-5 h-5 text-white" />
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 rounded-2xl bg-white/30"
                  />
                )}
              </div>
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
              )}
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-accent" />
        <h3>AI Agents</h3>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => {
          const config = agentConfig[activity.agent];
          const Icon = config.icon;
          const isActive = activity.status === "working";

          return (
            <motion.div
              key={activity.agent}
              animate={isActive ? { x: [0, 2, 0] } : {}}
              transition={{ repeat: isActive ? Infinity : 0, duration: 2 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/30 hover:bg-white/50 transition-colors"
            >
              <div className={`relative p-2 rounded-xl bg-gradient-to-br ${config.gradient}`}>
                {getStatusIcon(activity.status)}
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 rounded-xl bg-white/40"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium">{config.name}</h4>
                  {isActive && (
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="flex gap-1"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    </motion.div>
                  )}
                </div>

                {activity.currentTask && (
                  <p className="text-xs text-muted-foreground mb-1">{activity.currentTask}</p>
                )}

                {activity.lastAction && !isActive && (
                  <p className="text-xs text-muted-foreground">
                    {activity.lastAction}
                    {activity.actionTime && ` • ${activity.actionTime}`}
                  </p>
                )}

                {!activity.currentTask && !activity.lastAction && (
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
