"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Flame, Lock } from "lucide-react";

interface VaultCardProps {
  name: string;
  asset: string;
  apy: number;
  tvl: string;
  risk: "low" | "medium" | "high";
  strategy: string;
  delay?: number;
  live?: boolean;
  onClick?: () => void;
}

const riskConfig = {
  low: {
    icon: Shield,
    label: "Low Risk",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
  medium: {
    icon: Zap,
    label: "Medium Risk",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
  },
  high: {
    icon: Flame,
    label: "High Risk",
    color: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/20",
  },
};

export function VaultCard({ name, asset, apy, tvl, risk, strategy, delay = 0, live = false, onClick }: VaultCardProps) {
  const rc = riskConfig[risk];
  const RiskIcon = rc.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100, damping: 15 }}
      whileHover={live ? { y: -4, transition: { duration: 0.2 } } : undefined}
      onClick={live ? onClick : undefined}
      className={`bg-surface border border-border rounded-xl overflow-hidden transition-all ${
        live
          ? "hover:border-border-light group cursor-pointer"
          : "opacity-50 cursor-default"
      }`}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold">{name}</h3>
            <p className="text-sm text-text-muted mt-0.5">{asset}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${rc.color} ${rc.bg} border ${rc.border}`}>
            <RiskIcon className="w-3 h-3" />
            {rc.label}
          </div>
        </div>

        {/* APY */}
        <div className="mb-4">
          <span className="text-xs text-text-muted">Estimated APY</span>
          <motion.p
            className="text-3xl font-bold font-mono text-accent mt-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {apy.toFixed(1)}%
          </motion.p>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">TVL</span>
            <span className="font-mono">{tvl}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Strategy</span>
            <span className="text-text-secondary">{strategy}</span>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="px-5 py-3 border-t border-border bg-surface-light/50 flex items-center justify-between">
        {live ? (
          <>
            <span className="text-sm font-medium text-primary">Deposit</span>
            <motion.div
              className="text-primary"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
            >
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </>
        ) : (
          <>
            <span className="text-sm font-medium text-text-muted flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Coming Soon
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
}
