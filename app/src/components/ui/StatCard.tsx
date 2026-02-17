"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "./AnimatedNumber";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  change?: number;
  icon?: React.ReactNode;
  delay?: number;
}

export function StatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 2,
  change,
  icon,
  delay = 0,
}: StatCardProps) {
  const isPositive = change && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100, damping: 15 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-surface border border-border rounded-xl p-5 hover:border-border-light transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-text-muted">{label}</span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-surface-light flex items-center justify-center text-text-secondary">
            {icon}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <AnimatedNumber
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          className="text-2xl font-semibold text-text"
        />
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${isPositive ? "text-accent" : "text-danger"}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span className="font-mono">{isPositive ? "+" : ""}{change.toFixed(2)}%</span>
            <span className="text-text-muted">24h</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
