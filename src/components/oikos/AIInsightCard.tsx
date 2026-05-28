import { Brain, TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { StatusBadge } from "./StatusBadge";
import { motion } from "motion/react";

interface AIInsight {
  type: "analysis" | "warning" | "optimization" | "suggestion";
  title: string;
  description: string;
  metrics?: Array<{ label: string; value: string; status?: "success" | "warning" | "alert" }>;
  actions?: Array<{ label: string; onClick: () => void }>;
}

interface AIInsightCardProps {
  insight: AIInsight;
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  const iconMap = {
    analysis: Brain,
    warning: AlertTriangle,
    optimization: TrendingUp,
    suggestion: Lightbulb
  };

  const colorMap = {
    analysis: "from-primary to-secondary",
    warning: "from-warning to-alert",
    optimization: "from-success to-accent",
    suggestion: "from-accent to-primary"
  };

  const Icon = iconMap[insight.type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard gradient="mixed" className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, repeatDelay: 3 }}
            className={`p-3 rounded-2xl bg-gradient-to-br ${colorMap[insight.type]} shrink-0`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="mb-2">{insight.title}</h3>
            <p className="text-sm text-muted-foreground">{insight.description}</p>
          </div>
        </div>

        {insight.metrics && insight.metrics.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {insight.metrics.map((metric, idx) => (
              <StatusBadge key={idx} variant={metric.status || "info"}>
                {metric.label}: {metric.value}
              </StatusBadge>
            ))}
          </div>
        )}

        {insight.actions && insight.actions.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {insight.actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-secondary transition-colors"
              >
                {action.label}
                <ArrowRight className="w-4 h-4" />
              </button>
            ))}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
