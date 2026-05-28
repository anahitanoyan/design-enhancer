import { Bot, Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface AIAgentStatusProps {
  agent: "coordinator" | "task" | "reminder" | "grocery";
  status: "idle" | "working" | "completed";
  message?: string;
}

export function AIAgentStatus({ agent, status, message }: AIAgentStatusProps) {
  const agentNames = {
    coordinator: "Coordinator",
    task: "Task Agent",
    reminder: "Reminder Agent",
    grocery: "Grocery Agent"
  };

  const agentColors = {
    coordinator: "from-primary to-secondary",
    task: "from-secondary to-accent",
    reminder: "from-accent to-primary",
    grocery: "from-secondary to-primary"
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/30">
      <div className={`p-2 rounded-full bg-gradient-to-br ${agentColors[agent]}`}>
        {status === "working" ? (
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      <div className="flex-1">
        <h4 className="text-sm">{agentNames[agent]}</h4>
        {message && (
          <p className="text-xs text-muted-foreground">{message}</p>
        )}
      </div>

      {status === "working" && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-2 h-2 rounded-full bg-accent"
        />
      )}
    </div>
  );
}
