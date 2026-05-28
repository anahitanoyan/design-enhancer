import { Sparkles, CheckCircle2, X, ArrowRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { motion } from "motion/react";
import { useState } from "react";

interface Suggestion {
  id: string;
  type: "schedule" | "task" | "grocery" | "reminder";
  title: string;
  description: string;
  action: string;
  confidence?: number;
}

interface AISuggestionCardProps {
  suggestion: Suggestion;
  onAccept?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export function AISuggestionCard({ suggestion, onAccept, onDismiss }: AISuggestionCardProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const typeColors = {
    schedule: "from-primary to-secondary",
    task: "from-secondary to-accent",
    grocery: "from-accent to-primary",
    reminder: "from-primary to-accent"
  };

  const handleAccept = () => {
    setIsAccepted(true);
    setTimeout(() => onAccept?.(suggestion.id), 300);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setTimeout(() => onDismiss?.(suggestion.id), 300);
  };

  if (isDismissed || isAccepted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className={`p-4 bg-gradient-to-br ${typeColors[suggestion.type]}/10 border-l-4 border-l-accent`}>
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
            className="p-2 rounded-xl bg-gradient-to-br from-accent to-primary shrink-0"
          >
            <Sparkles className="w-4 h-4 text-white" />
          </motion.div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium mb-1">{suggestion.title}</h4>
            <p className="text-xs text-muted-foreground mb-3">{suggestion.description}</p>

            {suggestion.confidence && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Confidence</span>
                  <span className="text-xs font-medium">{suggestion.confidence}%</span>
                </div>
                <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${suggestion.confidence}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-accent to-primary"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-secondary transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {suggestion.action}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 rounded-xl bg-white/30 hover:bg-white/50 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
