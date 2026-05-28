import { X, Calendar, CheckSquare, ShoppingCart, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import mascotUrl from "@/assets/oikos-mascot.png";

interface FloatingAIButtonProps {
  onAction: (action: string) => void;
}

export function FloatingAIButton({ onAction }: FloatingAIButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    { id: "chat", label: "Chat with AI", icon: MessageCircle },
    { id: "plan", label: "Plan My Day", icon: Calendar },
    { id: "tasks", label: "Organize Tasks", icon: CheckSquare },
    { id: "grocery", label: "Smart Shopping", icon: ShoppingCart }
  ];

  return (
    <div className="fixed bottom-24 right-6 z-50 md:bottom-8 md:right-8">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 space-y-2 mb-2"
          >
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    onAction(action.id);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-card hover:bg-white/80 transition-all whitespace-nowrap"
                >
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{action.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary via-accent to-secondary shadow-lg flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <img src={mascotUrl} alt="Oik-Os" className="w-10 h-10 drop-shadow-md" />
          )}
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full bg-accent/50"
        />
      </motion.button>
    </div>
  );
}
