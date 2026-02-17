"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, X } from "lucide-react";
import { useState } from "react";

interface Step {
  title: string;
  description: string;
}

interface StepGuideProps {
  title: string;
  steps: Step[];
  onDismiss?: () => void;
}

export function StepGuide({ title, steps, onDismiss }: StepGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-surface border border-primary/20 rounded-xl p-5 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        <button
          onClick={() => {
            setDismissed(true);
            onDismiss?.();
          }}
          className="p-1 rounded hover:bg-surface-light text-text-muted hover:text-text transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-4">
        {steps.map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <motion.div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                i < currentStep
                  ? "bg-accent text-white"
                  : i === currentStep
                  ? "bg-primary text-white"
                  : "bg-surface-light text-text-muted"
              }`}
              animate={i === currentStep ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {i < currentStep ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </motion.div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 rounded ${
                  i < currentStep ? "bg-accent" : "bg-surface-light"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Current step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm font-medium mb-1">{steps[currentStep].title}</p>
          <p className="text-sm text-text-secondary leading-relaxed">
            {steps[currentStep].description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          className={`text-sm text-text-muted hover:text-text transition-colors ${
            currentStep === 0 ? "invisible" : ""
          }`}
        >
          Back
        </button>
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (currentStep < steps.length - 1) {
              setCurrentStep(currentStep + 1);
            } else {
              setDismissed(true);
              onDismiss?.();
            }
          }}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-light transition-colors"
        >
          {currentStep < steps.length - 1 ? "Next" : "Got it"}
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
