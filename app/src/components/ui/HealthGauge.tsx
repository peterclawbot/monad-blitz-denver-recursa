"use client";

import { motion } from "framer-motion";

interface HealthGaugeProps {
  value: number; // 0 to 3+
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function HealthGauge({ value, size = "md", showLabel = true }: HealthGaugeProps) {
  // Color based on health factor
  const getColor = (v: number) => {
    if (v >= 2) return { bar: "bg-accent", text: "text-accent", label: "Safe" };
    if (v >= 1.5) return { bar: "bg-warning", text: "text-warning", label: "Moderate" };
    return { bar: "bg-danger", text: "text-danger", label: "At Risk" };
  };

  const { bar, text, label } = getColor(value);
  const percentage = Math.min((value / 3) * 100, 100);

  const sizeClasses = {
    sm: { track: "h-1.5", font: "text-xs" },
    md: { track: "h-2", font: "text-sm" },
    lg: { track: "h-3", font: "text-base" },
  };

  const s = sizeClasses[size];

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className={`${s.font} text-text-muted`}>Health Factor</span>
          <div className="flex items-center gap-2">
            <span className={`${s.font} font-mono font-semibold ${text}`}>
              {value.toFixed(2)}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${text} bg-surface-light`}>
              {label}
            </span>
          </div>
        </div>
      )}
      <div className={`w-full ${s.track} bg-surface-light rounded-full overflow-hidden`}>
        <motion.div
          className={`h-full ${bar} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.2 }}
        />
      </div>
    </div>
  );
}
