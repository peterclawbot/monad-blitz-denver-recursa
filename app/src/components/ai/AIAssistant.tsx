"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ArrowRight,
  Check,
  Loader2,
  ChevronRight,
  Wallet,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useAccount } from "wagmi";
import { parseUnits } from "viem";
import { useLooper } from "@/hooks/useLooper";
import { useApproval } from "@/hooks/useVault";
import { useWallet } from "@/hooks/useWallet";
import { CONTRACTS } from "@/lib/contracts";
import { getTokenAddress, getTokenDecimals, getDebtAsset } from "@/lib/tokens";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  options?: string[];
  positionPreview?: PositionPreview;
};

type PositionPreview = {
  asset: string;
  amount: string;
  collateral: string;
  leverage: string;
  estimatedAPY: string;
  healthFactor: string;
  liquidationPrice: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Welcome to RecursaAI — the borrow/lend aggregator on Monad. I compare rates across Euler, Curvance, and more to find you the best yields. What would you like to do?",
    options: [
      "Create a leveraged loop",
      "Compare lending rates",
      "Find the best vault for me",
      "How does the aggregator work?",
    ],
  },
];

const FLOW_STEPS = [
  {
    question: "Which token would you like to use as collateral?",
    options: ["ETH", "USDC", "USDT", "WBTC", "MON"],
    key: "collateral",
  },
  {
    question: "How much would you like to deposit?",
    options: ["0.1", "0.5", "1", "5", "Custom"],
    key: "amount",
  },
  {
    question: "What leverage level are you comfortable with?",
    options: ["Conservative (1.5x)", "Moderate (2.5x)", "Aggressive (4x)", "Custom"],
    key: "leverage",
  },
  {
    question: "What is your risk tolerance?",
    options: ["Low — prioritize safety", "Medium — balanced approach", "High — maximize yield"],
    key: "risk",
  },
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [flowStep, setFlowStep] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (role: "user" | "assistant", content: string, extra?: Partial<Message>) => {
    const msg: Message = {
      id: Date.now().toString(),
      role,
      content,
      ...extra,
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  const simulateTyping = async (content: string, extra?: Partial<Message>) => {
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));
    setIsTyping(false);
    addMessage("assistant", content, extra);
  };

  // Track whether we're waiting for a custom free-text input (amount or leverage)
  const [awaitingCustomInput, setAwaitingCustomInput] = useState<string | null>(null);

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setFlowStep(-1);
    setSelections({});
    setAwaitingCustomInput(null);
    setInput("");
  };

  const advanceFlow = async (newSelections: Record<string, string>, currentStep: number) => {
    const nextStep = currentStep + 1;

    if (nextStep < FLOW_STEPS.length) {
      setFlowStep(nextStep);
      // Customize the amount question to include the selected token
      let question = FLOW_STEPS[nextStep].question;
      if (FLOW_STEPS[nextStep].key === "amount" && newSelections.collateral) {
        question = `How much ${newSelections.collateral} would you like to deposit?`;
      }
      await simulateTyping(question, {
        options: FLOW_STEPS[nextStep].options,
      });
    } else {
      // Flow complete — show position preview
      setFlowStep(-1);
      const asset = newSelections.collateral || "ETH";
      const amount = newSelections.amount || "1";
      const leverage = newSelections.leverage || "2.5x";

      // Calculate rough estimated APY based on leverage
      const levNum = parseFloat(leverage.replace(/[^0-9.]/g, "") || "2.5");
      const baseAPY = 5.8; // spread between supply and borrow
      const estAPY = (baseAPY * levNum).toFixed(1);
      const estHF = (2.0 / (levNum / 2)).toFixed(2);

      await simulateTyping(
        `Here is your optimized position. The AutoRebalancer will monitor it 24/7 and auto-adjust if the health factor drifts. You'll also start earning points immediately based on your TVL and leverage multiplier.`,
        {
          positionPreview: {
            asset,
            amount,
            collateral: `${amount} ${asset}`,
            leverage,
            estimatedAPY: `~${estAPY}%`,
            healthFactor: estHF,
            liquidationPrice: "$1,245.00",
          },
        }
      );
    }
  };

  const handleOptionClick = async (option: string) => {
    addMessage("user", option);

    if (flowStep === -1) {
      // Initial option selected
      if (option === "Create a leveraged loop") {
        setFlowStep(0);
        await simulateTyping(FLOW_STEPS[0].question, {
          options: FLOW_STEPS[0].options,
        });
      } else if (option === "Find the best vault for me") {
        await simulateTyping(
          "Here are the current vaults ranked by risk level:\n\n• Conservative USDC — 8.2% APY (lending optimization)\n• Conservative WBTC — 6.8% APY (lending optimization)\n• Delta-Neutral USDC — 11.5% APY (hedged basis trade)\n• Balanced ETH — 14.7% APY (loop + lending)\n• Aggressive ETH — 24.3% APY (max leverage loop)\n• MON Yield — 32.1% APY (LP farming + loop)\n\nAll vaults are ERC-4626 with timelocked strategy upgrades and emergency pause protection.",
          { options: ["Deposit into USDC Vault", "Deposit into ETH Vault", "I want the highest yield", "What are the risks?"] }
        );
      } else if (option === "Compare lending rates") {
        await simulateTyping(
          "Here are current rates across integrated protocols:\n\nETH Supply: Euler 4.2% · Curvance 5.1%\nETH Borrow: Euler 6.1% · Curvance 5.8%\nUSDC Supply: Euler 3.8% · Curvance 4.5%\nUSDC Borrow: Euler 5.2% · Curvance 4.9%\n\nRecursaAI automatically routes your position to the protocol with the best rate. For ETH looping right now, that means supplying on Curvance (5.1%) and borrowing on Curvance (5.8%).",
          { options: ["Create a leveraged loop", "How does the aggregator work?", "What are the risks?"] }
        );
      } else if (option === "Tell me about AutoRebalancer" || option === "How does the aggregator work?") {
        if (option === "How does the aggregator work?") {
          await simulateTyping(
            "RecursaAI queries supply and borrow rates from every integrated lending protocol (Euler, Curvance, and more as they deploy on Monad). For each asset:\n\n• We find the highest supply APY for your collateral.\n• We find the lowest borrow APY for your debt.\n• We route your position to the optimal protocol automatically.\n\nIf rates change, the AutoRebalancer can migrate your position. The LendingAggregator contract does this on-chain — fully transparent and verifiable.",
            { options: ["Compare lending rates", "Create a leveraged loop", "What are the risks?"] }
          );
        } else {
          await simulateTyping(
            "The AutoRebalancer is our DeFi Saver-style position guard. It monitors every position 24/7 and takes action automatically:\n\n• Auto-Repay: When health factor drops below your target, it reduces leverage to protect you from liquidation.\n• Auto-Boost: When health factor is above your max target, it increases leverage for more yield.\n\nYou configure the thresholds, cooldowns, and leverage bounds. Keepers execute on your behalf — even while you sleep.",
            { options: ["Create a leveraged loop", "Compare lending rates", "What are the risks?"] }
          );
        }
      } else if (option === "What are the risks?") {
        await simulateTyping(
          "Key risks to understand:\n\n• Liquidation: If your health factor drops below 1.0, your position can be liquidated. Higher leverage = higher risk.\n• Smart contract risk: All protocols carry some risk, though our contracts have 270+ tests and are open source.\n• Oracle risk: Price feeds could be manipulated in extreme cases.\n\nMitigations we built in:\n• AutoRebalancer monitors positions 24/7 and auto-deleverages before liquidation.\n• Isolated proxy per position — one can't affect another.\n• 24-hour timelock on all admin changes.\n• Guardian can emergency-pause the protocol.",
          { options: ["Create a leveraged loop", "Find the best vault for me", "Tell me about AutoRebalancer"] }
        );
      } else if (option === "I want the highest yield") {
        await simulateTyping(
          "For maximum yield, you have two paths:\n\n1. MON Yield Vault — 32.1% estimated APY. LP farming combined with leveraged looping. High risk.\n2. Manual 4-5x Loop — Create a custom leveraged loop with ETH or MON for maximum control.\n\nHigher yield always means higher risk. The AutoRebalancer helps by auto-deleveraging if your position gets risky.",
          { options: ["Create a leveraged loop", "Deposit into MON Vault", "What are the risks?"] }
        );
      } else if (option.startsWith("Deposit into")) {
        await simulateTyping(
          "To deposit into a vault, head to the Vaults page from the sidebar. Select your vault, enter the amount, and confirm the transaction. Vaults handle all the strategy execution automatically — you just deposit and earn.\n\nWant me to help you create a manual loop instead for more control?",
          { options: ["Create a leveraged loop", "Show me all vaults"] }
        );
      } else if (option === "Show me all vaults") {
        await simulateTyping(
          "You can browse all available vaults from the Vaults page in the sidebar. Each vault card shows the strategy type, risk level, estimated APY, and current TVL. Filter by risk level or sort by APY to find what suits you.",
          { options: ["Create a leveraged loop", "Find the best vault for me"] }
        );
      } else if (option === "Explain how looping works") {
        await simulateTyping(
          "Looping multiplies your yield exposure through recursive borrowing:\n\n1. You deposit collateral (e.g. 1 ETH) into a lending protocol.\n2. The protocol lets you borrow against it (e.g. 0.7 ETH worth of USDC).\n3. That USDC is swapped back to ETH.\n4. The new ETH is deposited as additional collateral.\n5. Steps 2-4 repeat until your target leverage is reached.\n\nRecursaAI compresses all these steps into a single transaction. A 2x loop means your effective position is 2x your initial deposit — earning roughly 2x the yield (minus borrowing costs).",
          { options: ["Create a leveraged loop", "What are the risks?"] }
        );
      } else {
        await simulateTyping(
          "I can help you get started. What would you like to do?",
          { options: ["Create a leveraged loop", "Find the best vault for me", "Tell me about AutoRebalancer", "How do points work?"] }
        );
      }
      return;
    }

    // Handle "Custom" option — ask user to type a value
    const stepKey = FLOW_STEPS[flowStep].key;
    if (option === "Custom") {
      setAwaitingCustomInput(stepKey);
      const prompt = stepKey === "amount"
        ? `Type the amount of ${selections.collateral || "tokens"} you want to deposit.`
        : "Type your desired leverage (e.g. 3.2x).";
      await simulateTyping(prompt);
      return;
    }

    // Save selection using the step key
    const newSelections = { ...selections, [stepKey]: option };
    setSelections(newSelections);
    await advanceFlow(newSelections, flowStep);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    addMessage("user", text);

    // If we're awaiting a custom free-text value, capture it and advance
    if (awaitingCustomInput && flowStep >= 0) {
      const key = awaitingCustomInput;
      setAwaitingCustomInput(null);

      // Validate numeric input
      const numValue = parseFloat(text);
      if (isNaN(numValue) || numValue <= 0) {
        await simulateTyping("Please enter a valid number greater than 0.", {
          options: FLOW_STEPS[flowStep].options,
        });
        return;
      }

      const value = key === "leverage" ? `Custom (${numValue}x)` : text;
      const newSelections = { ...selections, [key]: value };
      setSelections(newSelections);
      await advanceFlow(newSelections, flowStep);
      return;
    }

    // Send to Claude API for real AI responses
    setIsTyping(true);
    try {
      // Build conversation history for context
      const chatHistory = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));
      chatHistory.push({ role: "user", content: text });

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok) throw new Error("AI request failed");

      const data = await response.json();
      setIsTyping(false);

      if (data.error) {
        addMessage("assistant", "Sorry, I encountered an error. Try again or use the quick options below.", {
          options: ["Create a leveraged loop", "Compare lending rates", "Find the best vault for me"],
        });
      } else {
        addMessage("assistant", data.message.content, {
          options: ["Create a leveraged loop", "Compare lending rates", "Find the best vault for me"],
        });
      }
    } catch {
      setIsTyping(false);
      addMessage("assistant", "Sorry, I couldn't reach the AI service. Try using the quick options below.", {
        options: ["Create a leveraged loop", "Compare lending rates", "Find the best vault for me"],
      });
    }
  };

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg glow-primary z-30"
          >
            <Sparkles className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[600px] bg-surface sm:border sm:border-border sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">RecursaAI Assistant</h3>
                  <p className="text-xs text-text-muted">
                    Loops · Vaults · Strategy · Rewards
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 1 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetChat}
                    className="p-1.5 rounded-lg hover:bg-surface-light text-text-muted hover:text-text transition-colors"
                    title="New chat"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-surface-light text-text-muted hover:text-text transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    {msg.role === "assistant" ? (
                      <div className="space-y-3">
                        <div className="bg-surface-light rounded-xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed max-w-[90%]">
                          {msg.content}
                        </div>

                        {/* Quick options */}
                        {msg.options && (
                          <div className="flex flex-col gap-2 max-w-[90%]">
                            {msg.options.map((opt) => (
                              <motion.button
                                key={opt}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleOptionClick(opt)}
                                className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-border text-sm text-left hover:border-primary hover:bg-primary-glow transition-all group"
                              >
                                <span>{opt}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:text-primary transition-colors" />
                              </motion.button>
                            ))}
                          </div>
                        )}

                        {/* Position preview card */}
                        {msg.positionPreview && (
                          <PositionPreviewCard position={msg.positionPreview} />
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <div className="bg-primary/20 border border-primary/30 rounded-xl rounded-tr-sm px-4 py-3 text-sm max-w-[85%]">
                          {msg.content}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-text-muted text-sm"
                  >
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Thinking...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-border">
              <div className="flex items-center gap-2 bg-surface-light rounded-xl px-4 py-2.5">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask anything about strategies..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  className="p-1.5 rounded-lg text-text-muted hover:text-primary transition-colors"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PositionPreviewCard({ position }: { position: PositionPreview }) {
  const { address, isConnected } = useAccount();
  const { connectWallet } = useWallet();
  const { createLoop, txHash, isPending, isConfirming, isSuccess, error } = useLooper();

  // Resolve token details from the AI selection
  const tokenSymbol = position.asset === "ETH" ? "WETH" : position.asset;
  const collateralAddress = getTokenAddress(tokenSymbol);
  const debtInfo = getDebtAsset(tokenSymbol);
  const decimals = getTokenDecimals(tokenSymbol);

  // Parse leverage from display string (e.g., "Conservative (1.5x)" → 1.5, "Moderate (2.5x)" → 2.5)
  const parseLeverage = (lev: string): number => {
    const match = lev.match(/([\d.]+)x/);
    return match ? parseFloat(match[1]) : 2.5;
  };
  const leverageNum = parseLeverage(position.leverage);

  // Approval hook for the collateral token
  const {
    approve,
    needsApproval,
    isPending: approvalPending,
    isConfirming: approvalConfirming,
    isSuccess: approvalSuccess,
    refetchAllowance,
    error: approvalError,
  } = useApproval(collateralAddress, CONTRACTS.looper);

  const [txState, setTxState] = useState<"idle" | "approving" | "executing" | "confirming" | "confirmed" | "error">("idle");
  const [txError, setTxError] = useState<string | undefined>();

  // Guard ref: prevent approval→execute from firing more than once per flow
  const executedAfterApproval = useRef(false);

  // Use the amount from the AI flow (user-selected)
  const amount = position.amount || "1";
  const parsedAmount = parseUnits(amount, decimals);

  const executeLoop = useCallback(() => {
    const leverageWei = parseUnits(leverageNum.toFixed(1), 18);
    createLoop({
      collateralAsset: collateralAddress as `0x${string}`,
      debtAsset: debtInfo.address as `0x${string}`,
      amount: parsedAmount,
      targetLeverage: leverageWei,
      maxIterations: BigInt(10),
      minHealthFactor: parseUnits("1.2", 18),
      maxSlippage: BigInt(100), // 1%
      lendingAdapter: CONTRACTS.adapters.lendingPool as `0x${string}`,
      dexAdapter: CONTRACTS.adapters.mace as `0x${string}`,
    });
  }, [leverageNum, collateralAddress, debtInfo.address, parsedAmount, createLoop]);

  // Track approval → execute flow (guarded: only fires once per approval)
  useEffect(() => {
    if (approvalPending || approvalConfirming) setTxState("approving");
  }, [approvalPending, approvalConfirming]);

  useEffect(() => {
    if (approvalSuccess && !executedAfterApproval.current) {
      executedAfterApproval.current = true;
      refetchAllowance().then(() => {
        setTxState("executing");
        executeLoop();
      });
    }
  }, [approvalSuccess, refetchAllowance, executeLoop]);

  useEffect(() => {
    if (isPending) setTxState("executing");
  }, [isPending]);

  useEffect(() => {
    if (isConfirming) setTxState("confirming");
  }, [isConfirming]);

  useEffect(() => {
    if (isSuccess) setTxState("confirmed");
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      setTxState("error");
      setTxError(error.message?.slice(0, 120) ?? "Transaction failed");
    }
  }, [error]);

  // Handle approval errors (write + receipt combined)
  useEffect(() => {
    if (approvalError) {
      setTxState("error");
      setTxError(approvalError.message?.slice(0, 120) ?? "Approval failed");
    }
  }, [approvalError]);

  // Safety timeout: if stuck in confirming/approving for >90s
  useEffect(() => {
    if (txState === "confirming" || txState === "approving") {
      const timeout = setTimeout(() => {
        setTxState("error");
        setTxError("Transaction confirmation timed out. Check your wallet or the block explorer.");
      }, 90000);
      return () => clearTimeout(timeout);
    }
  }, [txState]);

  const handleCreate = () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    // Reset guard for new flow
    executedAfterApproval.current = false;
    setTxError(undefined);

    if (needsApproval(parsedAmount)) {
      setTxState("approving");
      approve(parsedAmount);
    } else {
      setTxState("executing");
      executeLoop();
    }
  };

  const isProcessing = txState !== "idle" && txState !== "confirmed" && txState !== "error";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface-light border border-border rounded-xl overflow-hidden max-w-[95%]"
    >
      <div className="px-4 py-3 border-b border-border">
        <h4 className="text-sm font-semibold">Position Summary</h4>
      </div>
      <div className="px-4 py-3 space-y-2.5">
        <Row label="Asset" value={position.asset} />
        <Row label="Amount" value={`${amount} ${tokenSymbol}`} />
        <Row label="Leverage" value={`${leverageNum}x`} />
        <Row label="Borrow Asset" value={debtInfo.symbol} />
        <Row label="Est. APY" value={position.estimatedAPY} highlight="accent" />
        <Row label="Health Factor" value={position.healthFactor} highlight="accent" />
        <Row label="Liq. Price" value={position.liquidationPrice} highlight="warning" />
      </div>

      {txError && (
        <div className="px-4 py-2">
          <div className="flex items-start gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-400">{txError}</p>
          </div>
        </div>
      )}

      {txHash && txState === "confirmed" && (
        <div className="px-4 py-2">
          <a
            href={`https://testnet.monadexplorer.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            View on Explorer →
          </a>
        </div>
      )}

      <div className="px-4 py-3 border-t border-border">
        <motion.button
          whileHover={!isProcessing && txState !== "confirmed" ? { scale: 1.02 } : {}}
          whileTap={!isProcessing && txState !== "confirmed" ? { scale: 0.98 } : {}}
          onClick={handleCreate}
          disabled={isProcessing || txState === "confirmed"}
          className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
            txState === "confirmed"
              ? "bg-accent/20 text-accent border border-accent/30"
              : txState === "error"
              ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
              : isProcessing
              ? "bg-surface text-text-muted cursor-wait"
              : !isConnected
              ? "bg-primary text-white hover:bg-primary-dark glow-primary"
              : "bg-primary text-white hover:bg-primary-dark glow-primary"
          }`}
        >
          {!isConnected ? (
            <>
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </>
          ) : txState === "confirmed" ? (
            <>
              <Check className="w-4 h-4" />
              Position Created!
            </>
          ) : txState === "error" ? (
            <>
              <AlertTriangle className="w-4 h-4" />
              Retry
            </>
          ) : txState === "approving" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Approving...
            </>
          ) : txState === "executing" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Position...
            </>
          ) : txState === "confirming" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Confirming...
            </>
          ) : (
            <>
              <ArrowRight className="w-4 h-4" />
              Create Position
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "accent" | "warning";
}) {
  const valueColor =
    highlight === "accent"
      ? "text-accent"
      : highlight === "warning"
      ? "text-warning"
      : "text-text";

  return (
    <div className="flex justify-between text-sm">
      <span className="text-text-muted">{label}</span>
      <span className={`font-mono font-medium ${valueColor}`}>{value}</span>
    </div>
  );
}
