import { motion } from "motion/react";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  gradient?: "peach" | "blue" | "teal" | "mixed";
  onClick?: () => void;
}

export function GlassCard({ children, className = "", gradient, onClick }: GlassCardProps) {
  const gradientClass = gradient
    ? gradient === "peach"
      ? "bg-gradient-to-br from-[#FFE5D9] to-[#FFF5F0]"
      : gradient === "blue"
      ? "bg-gradient-to-br from-[#E8F4F8] to-[#D6EAF8]"
      : gradient === "teal"
      ? "bg-gradient-to-br from-[#D5F4F5] to-[#E0F7FA]"
      : "bg-gradient-to-br from-[#FFE5D9] via-[#E8F4F8] to-[#D5F4F5]"
    : "";

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`glass-card p-6 ${gradientClass} ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
    </motion.div>
  );
}
