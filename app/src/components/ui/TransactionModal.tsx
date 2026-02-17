"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2, AlertTriangle, ExternalLink } from "lucide-react";

export type TxStep = {
  label: string;
  status: "pending" | "active" | "complete" | "error";
  hash?: string;
};

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: TxStep[];
  error?: string;
}

export function TransactionModal({ isOpen, onClose, title, steps, error }: TransactionModalProps) {
  const isComplete = steps.every((s) => s.status === "complete");
  const hasError = steps.some((s) => s.status === "error");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 pointer-events-auto shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-surface-light text-text-muted hover:text-text transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Steps */}
              <div className="space-y-4 mb-6">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    {/* Step indicator */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        step.status === "complete"
                          ? "bg-accent text-white"
                          : step.status === "active"
                          ? "bg-primary text-white"
                          : step.status === "error"
                          ? "bg-danger text-white"
                          : "bg-surface-light text-text-muted"
                      }`}
                    >
                      {step.status === "complete" ? (
                        <Check className="w-4 h-4" />
                      ) : step.status === "active" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : step.status === "error" ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-xs font-semibold">{i + 1}</span>
                      )}
                    </div>

                    {/* Label */}
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          step.status === "pending" ? "text-text-muted" : "text-text"
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.hash && (
                        <a
                          href={`https://testnet.monadexplorer.com/tx/${step.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary-light transition-colors mt-0.5"
                        >
                          View transaction
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Connection line */}
                    {i < steps.length - 1 && (
                      <div className="absolute left-9 mt-8 w-0.5 h-4 bg-border" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 p-3 bg-danger/10 border border-danger/20 rounded-lg mb-4"
                >
                  <AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                  <p className="text-xs text-danger">{error}</p>
                </motion.div>
              )}

              {/* Done state */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-2"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-sm font-medium">Transaction Complete</p>
                </motion.div>
              )}

              {/* Close button */}
              {(isComplete || hasError) && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl text-sm font-medium bg-surface-light text-text hover:bg-surface-hover transition-colors"
                >
                  {isComplete ? "Done" : "Close"}
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
