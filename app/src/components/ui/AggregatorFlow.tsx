"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Check, Zap, TrendingUp, Shield } from "lucide-react";

type Step = {
  id: number;
  icon: React.ReactNode;
  label: string;
  detail: string;
};

const STEPS: Step[] = [
  {
    id: 1,
    icon: <Search className="w-4 h-4" />,
    label: "Query Protocols",
    detail: "Checking Euler V2, Curvance...",
  },
  {
    id: 2,
    icon: <TrendingUp className="w-4 h-4" />,
    label: "Compare Rates",
    detail: "Finding best supply & borrow APY",
  },
  {
    id: 3,
    icon: <Zap className="w-4 h-4" />,
    label: "Optimize Route",
    detail: "Building optimal loop strategy",
  },
  {
    id: 4,
    icon: <Shield className="w-4 h-4" />,
    label: "Execute",
    detail: "Single tx on Monad",
  },
];

type AggregatorFlowProps = {
  isActive?: boolean;
  onComplete?: () => void;
};

export function AggregatorFlow({ isActive = false, onComplete }: AggregatorFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0);
      setCompleted(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length) {
          clearInterval(interval);
          setCompleted(true);
          onComplete?.();
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  if (!isActive && !completed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 rounded-xl border border-primary/20 p-4 mb-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
          <Zap className="w-3 h-3 text-primary" />
        </div>
        <span className="text-sm font-medium text-white">Aggregator in Action</span>
      </div>

      <div className="flex items-center justify-between gap-2">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex items-center gap-2 flex-1">
            <motion.div
              initial={false}
              animate={{
                scale: currentStep === idx + 1 ? 1.1 : 1,
                backgroundColor:
                  currentStep > idx
                    ? "rgb(16, 185, 129)"
                    : currentStep === idx + 1
                    ? "rgb(99, 102, 241)"
                    : "rgb(39, 39, 42)",
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            >
              {currentStep > idx ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <span className={currentStep === idx + 1 ? "text-white" : "text-zinc-500"}>
                  {step.icon}
                </span>
              )}
            </motion.div>

            <div className="hidden sm:block min-w-0">
              <p
                className={`text-xs font-medium truncate ${
                  currentStep >= idx + 1 ? "text-white" : "text-zinc-500"
                }`}
              >
                {step.label}
              </p>
              <AnimatePresence mode="wait">
                {currentStep === idx + 1 && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="text-[10px] text-zinc-400 truncate"
                  >
                    {step.detail}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {idx < STEPS.length - 1 && (
              <ArrowRight
                className={`w-3 h-3 shrink-0 ${
                  currentStep > idx + 1 ? "text-emerald-500" : "text-zinc-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {completed && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 pt-3 border-t border-primary/10 flex items-center justify-between"
        >
          <span className="text-xs text-emerald-400">Optimal strategy found</span>
          <span className="text-xs text-zinc-400">Ready to execute</span>
        </motion.div>
      )}
    </motion.div>
  );
}
