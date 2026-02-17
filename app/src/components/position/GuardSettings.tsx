"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  TrendingUp,
  TrendingDown,
  Activity,
  Check,
  Loader2,
  AlertTriangle,
  X,
  Info,
} from "lucide-react";
import { parseUnits, formatUnits } from "viem";
import { usePositionGuard } from "@/hooks/usePositionGuard";

interface GuardSettingsProps {
  positionId: bigint;
  currentHealthFactor?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function GuardSettings({ positionId, currentHealthFactor, isOpen, onClose }: GuardSettingsProps) {
  const {
    guardConfig,
    isGuardDeployed,
    setStopLoss,
    removeStopLoss,
    setTakeProfit,
    removeTakeProfit,
    setTrailingStop,
    removeTrailingStop,
    isPending,
    isConfirming,
    isSuccess,
    error,
  } = usePositionGuard(positionId);

  // Local form state
  const [slEnabled, setSlEnabled] = useState(false);
  const [slThreshold, setSlThreshold] = useState("1.2");
  const [tpEnabled, setTpEnabled] = useState(false);
  const [tpTarget, setTpTarget] = useState("20"); // 20% profit
  const [tsEnabled, setTsEnabled] = useState(false);
  const [tsTrail, setTsTrail] = useState("10"); // 10% trail
  const [maxSlippage, setMaxSlippage] = useState("200"); // 2% in bps
  const [activeTab, setActiveTab] = useState<"stopLoss" | "takeProfit" | "trailingStop">("stopLoss");
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Sync from on-chain config
  useEffect(() => {
    if (guardConfig) {
      setSlEnabled(guardConfig.stopLossEnabled);
      if (guardConfig.stopLossHF > BigInt(0)) {
        setSlThreshold(Number(formatUnits(guardConfig.stopLossHF, 18)).toFixed(2));
      }
      setTpEnabled(guardConfig.takeProfitEnabled);
      if (guardConfig.takeProfitBps > BigInt(0)) {
        setTpTarget((Number(guardConfig.takeProfitBps) / 100).toString());
      }
      setTsEnabled(guardConfig.trailingStopEnabled);
      if (guardConfig.trailingStopBps > BigInt(0)) {
        setTsTrail((Number(guardConfig.trailingStopBps) / 100).toString());
      }
    }
  }, [guardConfig]);

  // Reset success state
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => setLastAction(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const [saveTimeout, setSaveTimeout] = useState(false);

  const handleSaveStopLoss = () => {
    const threshold = parseUnits(slThreshold, 18);
    const slip = BigInt(maxSlippage);
    if (slEnabled) {
      setStopLoss(positionId, threshold, slip);
    } else {
      removeStopLoss(positionId);
    }
    setLastAction("stopLoss");
  };

  const handleSaveTakeProfit = () => {
    const targetBps = BigInt(Math.round(parseFloat(tpTarget) * 100));
    const slip = BigInt(maxSlippage);
    if (tpEnabled) {
      setTakeProfit(positionId, targetBps, slip);
    } else {
      removeTakeProfit(positionId);
    }
    setLastAction("takeProfit");
  };

  const handleSaveTrailingStop = () => {
    const trailBps = BigInt(Math.round(parseFloat(tsTrail) * 100));
    const slip = BigInt(maxSlippage);
    if (tsEnabled) {
      setTrailingStop(positionId, trailBps, slip);
    } else {
      removeTrailingStop(positionId);
    }
    setLastAction("trailingStop");
  };

  const isProcessing = isPending || isConfirming;

  // Timeout safeguard: if stuck saving for >90s
  useEffect(() => {
    if (isProcessing && lastAction) {
      const timeout = setTimeout(() => {
        setSaveTimeout(true);
      }, 90000);
      return () => clearTimeout(timeout);
    } else {
      setSaveTimeout(false);
    }
  }, [isProcessing, lastAction]);

  const tabs = [
    { key: "stopLoss" as const, label: "Stop-Loss", icon: Shield, color: "text-danger" },
    { key: "takeProfit" as const, label: "Take-Profit", icon: TrendingUp, color: "text-accent" },
    { key: "trailingStop" as const, label: "Trailing", icon: Activity, color: "text-primary" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
          >
            <div className="bg-surface border border-border rounded-2xl w-full max-w-lg pointer-events-auto shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h2 className="text-lg font-semibold">Position Guards</h2>
                  <p className="text-xs text-text-muted mt-0.5">
                    Position #{positionId.toString()}
                    {currentHealthFactor !== undefined && (
                      <> · HF: {currentHealthFactor.toFixed(2)}</>
                    )}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-surface-light text-text-muted hover:text-text transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!isGuardDeployed ? (
                <div className="p-8 text-center">
                  <Shield className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-sm font-medium mb-1">Position Guards Coming Soon</p>
                  <p className="text-xs text-text-muted">
                    Automated stop-loss, take-profit, and trailing stop protection will be available after mainnet deployment.
                  </p>
                </div>
              ) : (
                <>
                  {/* Tab bar */}
                  <div className="flex border-b border-border">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors relative ${
                          activeTab === tab.key
                            ? "text-text"
                            : "text-text-muted hover:text-text"
                        }`}
                      >
                        <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.key ? tab.color : ""}`} />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.label.split("-")[0]}</span>
                        {activeTab === tab.key && (
                          <motion.div
                            layoutId="guard-tab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <div className="p-5 space-y-4">
                    {activeTab === "stopLoss" && (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Stop-Loss Protection</p>
                            <p className="text-xs text-text-muted mt-0.5">
                              Auto-close position when health factor drops below threshold
                            </p>
                          </div>
                          <ToggleSwitch enabled={slEnabled} onChange={setSlEnabled} />
                        </div>
                        {slEnabled && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-3"
                          >
                            <div>
                              <label className="text-xs text-text-muted mb-1.5 block">
                                Health Factor Threshold
                              </label>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={slThreshold}
                                onChange={(e) => setSlThreshold(e.target.value)}
                                placeholder="1.2"
                                className="w-full bg-surface-light rounded-lg border border-border px-4 py-2.5 text-sm font-mono outline-none focus:border-primary transition-colors"
                              />
                              <p className="text-[11px] text-text-muted mt-1">
                                Position will auto-close when HF drops below this value
                              </p>
                            </div>
                            <SlippageInput value={maxSlippage} onChange={setMaxSlippage} />
                          </motion.div>
                        )}
                        <SaveButton
                          onClick={handleSaveStopLoss}
                          isProcessing={isProcessing && lastAction === "stopLoss"}
                          isSuccess={isSuccess && lastAction === "stopLoss"}
                        />
                      </>
                    )}

                    {activeTab === "takeProfit" && (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Take-Profit</p>
                            <p className="text-xs text-text-muted mt-0.5">
                              Auto-close when position profit exceeds target
                            </p>
                          </div>
                          <ToggleSwitch enabled={tpEnabled} onChange={setTpEnabled} />
                        </div>
                        {tpEnabled && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-3"
                          >
                            <div>
                              <label className="text-xs text-text-muted mb-1.5 block">
                                Profit Target (%)
                              </label>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={tpTarget}
                                onChange={(e) => setTpTarget(e.target.value)}
                                placeholder="20"
                                className="w-full bg-surface-light rounded-lg border border-border px-4 py-2.5 text-sm font-mono outline-none focus:border-primary transition-colors"
                              />
                              <p className="text-[11px] text-text-muted mt-1">
                                Position will close when collateral value grows {tpTarget || "0"}% above initial deposit
                              </p>
                            </div>
                            <SlippageInput value={maxSlippage} onChange={setMaxSlippage} />
                          </motion.div>
                        )}
                        <SaveButton
                          onClick={handleSaveTakeProfit}
                          isProcessing={isProcessing && lastAction === "takeProfit"}
                          isSuccess={isSuccess && lastAction === "takeProfit"}
                        />
                      </>
                    )}

                    {activeTab === "trailingStop" && (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Trailing Stop</p>
                            <p className="text-xs text-text-muted mt-0.5">
                              Auto-close when profit drops from peak by trail amount
                            </p>
                          </div>
                          <ToggleSwitch enabled={tsEnabled} onChange={setTsEnabled} />
                        </div>
                        {tsEnabled && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-3"
                          >
                            <div>
                              <label className="text-xs text-text-muted mb-1.5 block">
                                Trail Amount (%)
                              </label>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={tsTrail}
                                onChange={(e) => setTsTrail(e.target.value)}
                                placeholder="10"
                                className="w-full bg-surface-light rounded-lg border border-border px-4 py-2.5 text-sm font-mono outline-none focus:border-primary transition-colors"
                              />
                              <p className="text-[11px] text-text-muted mt-1">
                                Tracks peak collateral value. Closes if it drops {tsTrail || "0"}% from peak.
                              </p>
                            </div>
                            <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                              <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                              <p className="text-[11px] text-text-muted leading-relaxed">
                                Trailing stops lock in gains while giving room for upside.
                                The stop follows the price up but never down.
                              </p>
                            </div>
                            <SlippageInput value={maxSlippage} onChange={setMaxSlippage} />
                          </motion.div>
                        )}
                        <SaveButton
                          onClick={handleSaveTrailingStop}
                          isProcessing={isProcessing && lastAction === "trailingStop"}
                          isSuccess={isSuccess && lastAction === "trailingStop"}
                        />
                      </>
                    )}

                    {(error || saveTimeout) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-start gap-2 p-3 bg-danger/10 border border-danger/20 rounded-lg"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-danger shrink-0 mt-0.5" />
                        <p className="text-xs text-danger">
                          {saveTimeout
                            ? "Transaction confirmation timed out. Check the block explorer for status."
                            : error?.message?.slice(0, 150) ?? "Transaction failed"}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Subcomponents ──

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled ? "bg-primary" : "bg-surface-light border border-border"
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-1 w-4 h-4 rounded-full ${
          enabled ? "bg-white" : "bg-text-muted"
        }`}
      />
    </button>
  );
}

function SlippageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-text-muted mb-1.5 block">Max Slippage (bps)</label>
      <div className="flex gap-2">
        {["100", "200", "300", "500"].map((bps) => (
          <button
            key={bps}
            onClick={() => onChange(bps)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
              value === bps
                ? "bg-primary text-white"
                : "bg-surface-light text-text-muted hover:text-text border border-border"
            }`}
          >
            {(parseInt(bps) / 100).toFixed(1)}%
          </button>
        ))}
      </div>
    </div>
  );
}

function SaveButton({
  onClick,
  isProcessing,
  isSuccess,
}: {
  onClick: () => void;
  isProcessing: boolean;
  isSuccess: boolean;
}) {
  return (
    <motion.button
      whileHover={!isProcessing ? { scale: 1.02 } : {}}
      whileTap={!isProcessing ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={isProcessing}
      className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
        isSuccess
          ? "bg-accent/20 text-accent border border-accent/30"
          : isProcessing
          ? "bg-surface-light text-text-muted cursor-wait"
          : "bg-primary text-white hover:bg-primary-dark"
      }`}
    >
      {isSuccess ? (
        <>
          <Check className="w-4 h-4" />
          Saved
        </>
      ) : isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Saving...
        </>
      ) : (
        "Save Guard Settings"
      )}
    </motion.button>
  );
}
