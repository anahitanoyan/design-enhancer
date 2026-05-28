import { AlertTriangle, Calendar, Clock, Users, ArrowRight, CheckCircle2, X } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { motion } from "motion/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Conflict {
  id: string;
  type: "time_overlap" | "double_booking" | "resource_conflict";
  severity: "high" | "medium" | "low";
  event1: {
    title: string;
    time: string;
    attendees: string[];
  };
  event2: {
    title: string;
    time: string;
    attendees: string[];
  };
  aiSolution?: {
    description: string;
    confidence: number;
  };
}

interface ConflictResolutionCardProps {
  conflict: Conflict;
  onResolve?: (id: string, solution: string) => void;
  onDismiss?: (id: string) => void;
}

export function ConflictResolutionCard({ conflict, onResolve, onDismiss }: ConflictResolutionCardProps) {
  const severityColors = {
    high: "from-alert to-warning",
    medium: "from-warning to-accent",
    low: "from-accent to-primary"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="p-5 border-l-4 border-l-alert">
        <div className="flex items-start gap-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`p-2 rounded-xl bg-gradient-to-br ${severityColors[conflict.severity]}`}
          >
            <AlertTriangle className="w-5 h-5 text-white" />
          </motion.div>

          <div className="flex-1">
            <h4 className="mb-1">Schedule Conflict Detected</h4>
            <p className="text-xs text-muted-foreground">
              {conflict.severity === "high" ? "Urgent" : conflict.severity === "medium" ? "Moderate" : "Low"} priority
            </p>
          </div>
        </div>

        {/* Conflicting Events */}
        <div className="space-y-3 mb-4">
          {/* Event 1 */}
          <div className="p-3 rounded-xl bg-white/30">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h5 className="text-sm font-medium">{conflict.event1.title}</h5>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {conflict.event1.time}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <div className="flex -space-x-2">
                  {conflict.event1.attendees.slice(0, 3).map((name, idx) => (
                    <Avatar key={idx} className="w-4 h-4 border border-white">
                      <AvatarFallback className="text-[8px] bg-primary text-primary-foreground">
                        {name[0]}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Conflict Indicator */}
          <div className="flex justify-center">
            <div className="px-3 py-1 rounded-full bg-alert/20 text-alert text-xs font-medium">
              Conflicts with ↓
            </div>
          </div>

          {/* Event 2 */}
          <div className="p-3 rounded-xl bg-white/30">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h5 className="text-sm font-medium">{conflict.event2.title}</h5>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {conflict.event2.time}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <div className="flex -space-x-2">
                  {conflict.event2.attendees.slice(0, 3).map((name, idx) => (
                    <Avatar key={idx} className="w-4 h-4 border border-white">
                      <AvatarFallback className="text-[8px] bg-primary text-primary-foreground">
                        {name[0]}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Solution */}
        {conflict.aiSolution && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 mb-4">
            <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              AI Suggested Solution
            </h5>
            <p className="text-xs text-muted-foreground mb-3">{conflict.aiSolution.description}</p>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Confidence</span>
                <span className="text-xs font-medium">{conflict.aiSolution.confidence}%</span>
              </div>
              <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${conflict.aiSolution.confidence}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-accent to-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {conflict.aiSolution && (
            <button
              onClick={() => onResolve?.(conflict.id, "ai")}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-secondary transition-colors"
            >
              Apply AI Solution
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onResolve?.(conflict.id, "manual")}
            className="px-4 py-2.5 rounded-xl bg-white/30 hover:bg-white/50 text-sm font-medium transition-colors"
          >
            Resolve Manually
          </button>
          <button
            onClick={() => onDismiss?.(conflict.id)}
            className="p-2.5 rounded-xl bg-white/30 hover:bg-white/50 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
