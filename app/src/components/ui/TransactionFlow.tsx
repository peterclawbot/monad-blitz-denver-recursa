"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2, AlertTriangle, ExternalLink, RefreshCw } from "lucide-react";
import { getExplorerTxUrl } from "@/lib/explorer";

export type TxState =
  | "idle"
  | "approving"
  | "approved"
  | "executing"
  | "confirming"
  | "confirmed"
  | "error";

interface TransactionFlowProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  state: TxState;
  approvalTxHash?: string;
  executeTxHash?: string;
  error?: string;
  onRetry?: () => void;
  successMessage?: string;
  successLink?: { label: string; href: string };
}

const stateConfig: Record<
  TxState,
  { steps: { label: string; status: "pending" | "active" | "complete" | "error" }[] }
> = {
  idle: { steps: [] },
  approving: {
    steps: [
      { label: "Approve token spending", status: "active" },
      { label: "Execute transaction", status: "pending" },
      { label: "Confirm on chain", status: "pending" },
    ],
  },
  approved: {
    steps: [
      { label: "Approve token spending", status: "complete" },
      { label: "Execute transaction", status: "active" },
      { label: "Confirm on chain", status: "pending" },
    ],
  },
  executing: {
    steps: [
      { label: "Approve token spending", status: "complete" },
      { label: "Execute transaction", status: "active" },
      { label: "Confirm on chain", status: "pending" },
    ],
  },
  confirming: {
    steps: [
      { label: "Approve token spending", status: "complete" },
      { label: "Execute transaction", status: "complete" },
      { label: "Confirm on chain", status: "active" },
    ],
  },
  confirmed: {
    steps: [
      { label: "Approve token spending", status: "complete" },
      { label: "Execute transaction", status: "complete" },
      { label: "Confirm on chain", status: "complete" },
    ],
  },
  error: {
    steps: [
      { label: "Transaction failed", status: "error" },
    ],
  },
};

export function TransactionFlow({
  isOpen,
  onClose,
  title,
  state,
  approvalTxHash,
  executeTxHash,
  error,
  onRetry,
  successMessage,
  successLink,
}: TransactionFlowProps) {
  const { steps } = stateConfig[state];
  const isComplete = state === "confirmed";
  const hasError = state === "error";

  return (
    <AnimatePresence>
      {isOpen && state !== "idle" && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={isComplete || hasError ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-surface border border-border rounded-2xl w-full max-w-md mx-4 sm:mx-auto p-5 sm:p-6 pointer-events-auto shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">{title}</h2>
                {(isComplete || hasError) && (
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-surface-light text-text-muted hover:text-text transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Steps */}
              <div className="space-y-4 mb-6">
                {steps.map((step, i) => (
                  <motion.div
                    key={`${state}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
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

                    {/* Label + tx hash */}
                    <div className="flex-1 pt-1">
                      <p
                        className={`text-sm font-medium ${
                          step.status === "pending" ? "text-text-muted" : "text-text"
                        }`}
                      >
                        {step.label}
                      </p>
                      {/* Show approval hash on step 0 */}
                      {i === 0 && approvalTxHash && step.status === "complete" && (
                        <a
                          href={getExplorerTxUrl(approvalTxHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary-light transition-colors mt-0.5"
                        >
                          View approval tx
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {/* Show execute hash on step 1 or 2 */}
                      {i >= 1 && executeTxHash && (step.status === "complete" || step.status === "active") && (
                        <a
                          href={getExplorerTxUrl(executeTxHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary-light transition-colors mt-0.5"
                        >
                          View transaction
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Error message */}
              {hasError && error && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 p-3 bg-danger/10 border border-danger/20 rounded-lg mb-4"
                >
                  <AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                  <p className="text-xs text-danger leading-relaxed">{error}</p>
                </motion.div>
              )}

              {/* Success state */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-2"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-sm font-medium">
                    {successMessage ?? "Transaction Complete!"}
                  </p>
                  {executeTxHash && (
                    <a
                      href={getExplorerTxUrl(executeTxHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary-light transition-colors mt-2 justify-center"
                    >
                      View on Explorer
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {successLink && (
                    <a
                      href={successLink.href}
                      className="inline-block mt-3 text-xs text-primary hover:text-primary-light transition-colors"
                    >
                      {successLink.label} →
                    </a>
                  )}
                </motion.div>
              )}

              {/* Action buttons */}
              {(isComplete || hasError) && (
                <div className="flex gap-3 mt-4">
                  {hasError && onRetry && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onRetry}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Retry
                    </motion.button>
                  )}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-surface-light text-text hover:bg-surface-hover transition-colors"
                  >
                    {isComplete ? "Done" : "Close"}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
