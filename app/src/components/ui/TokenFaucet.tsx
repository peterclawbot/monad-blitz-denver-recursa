"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Check, Loader2, X, ExternalLink } from "lucide-react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useSwitchChain, useChainId } from "wagmi";
import { parseUnits } from "viem";
import { MOCK_ERC20_ABI } from "@/lib/contracts";
import { MINTABLE_TOKENS } from "@/lib/tokens";
import { getExplorerTxUrl } from "@/lib/explorer";
import { monad } from "@/lib/chains";

export function TokenFaucet() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const isCorrectChain = chainId === monad.id;
  const [isOpen, setIsOpen] = useState(false);
  const [mintingToken, setMintingToken] = useState<string | null>(null);
  const [mintedTokens, setMintedTokens] = useState<Set<string>>(new Set());
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);
  const { writeContractAsync } = useWriteContract();

  const ensureChain = async () => {
    if (!isCorrectChain) {
      try {
        await switchChainAsync({ chainId: monad.id });
      } catch {
        return false;
      }
    }
    return true;
  };

  const handleMint = async (token: (typeof MINTABLE_TOKENS)[number]) => {
    if (!address || !(await ensureChain())) return;
    setMintingToken(token.symbol);
    setLastTxHash(null);
    setMintError(null);
    try {
      const hash = await writeContractAsync({
        address: token.address,
        abi: MOCK_ERC20_ABI,
        functionName: "mint",
        args: [address, parseUnits(token.amount, token.decimals)],
      });
      setLastTxHash(hash);
      setMintedTokens((prev) => new Set(prev).add(token.symbol));
      setMintingToken(null);
    } catch (err: unknown) {
      setMintingToken(null);
      const msg = err instanceof Error ? err.message : "Mint failed";
      if (msg.includes("User rejected") || msg.includes("user rejected")) {
        setMintError("Transaction rejected in wallet.");
      } else {
        setMintError(`Failed to mint ${token.symbol}: ${msg.slice(0, 100)}`);
      }
    }
  };

  const handleMintAll = async () => {
    if (!address || !(await ensureChain())) return;
    setMintingToken("ALL");
    setMintedTokens(new Set());
    setLastTxHash(null);
    setMintError(null);
    try {
      // Mint sequentially to avoid wallet popup overload
      for (const token of MINTABLE_TOKENS) {
        try {
          const hash = await writeContractAsync({
            address: token.address,
            abi: MOCK_ERC20_ABI,
            functionName: "mint",
            args: [address, parseUnits(token.amount, token.decimals)],
          });
          setMintedTokens((prev) => new Set(prev).add(token.symbol));
          setLastTxHash(hash);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "";
          if (msg.includes("User rejected") || msg.includes("user rejected")) {
            setMintError("Minting cancelled — wallet rejected.");
            break; // Stop on user rejection
          }
          // Skip individual failures but continue with others
          setMintError(`Some tokens failed to mint. Try minting individually.`);
        }
      }
      setMintingToken(null);
    } catch {
      setMintingToken(null);
    }
  };

  if (!isConnected) return null;

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
      >
        <Droplets className="w-3.5 h-3.5" />
        Faucet
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-surface border border-border rounded-2xl w-full max-w-sm p-6 pointer-events-auto shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Droplets className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Testnet Faucet</h2>
                      <p className="text-xs text-text-muted">Mint test tokens</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-surface-light text-text-muted hover:text-text transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  {MINTABLE_TOKENS.map((token) => (
                    <div
                      key={token.symbol}
                      className="flex items-center justify-between p-3 bg-surface-light rounded-lg border border-border"
                    >
                      <div>
                        <p className="text-sm font-medium">{token.symbol}</p>
                        <p className="text-xs text-text-muted">
                          {token.amount} {token.symbol}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMint(token)}
                        disabled={mintingToken !== null}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                          mintedTokens.has(token.symbol)
                            ? "bg-accent/10 text-accent"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                        }`}
                      >
                        {mintingToken === token.symbol || (mintingToken === "ALL" && !mintedTokens.has(token.symbol)) ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : mintedTokens.has(token.symbol) ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          "Mint"
                        )}
                      </motion.button>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMintAll}
                  disabled={mintingToken !== null}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {mintingToken === "ALL" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Minting All...
                    </>
                  ) : (
                    <>
                      <Droplets className="w-4 h-4" />
                      Mint All Tokens
                    </>
                  )}
                </motion.button>

                {mintError && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex items-start gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg"
                  >
                    <X className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-400">{mintError}</p>
                  </motion.div>
                )}

                {lastTxHash && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-center"
                  >
                    <a
                      href={getExplorerTxUrl(lastTxHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary-light transition-colors justify-center"
                    >
                      <Check className="w-3 h-3" />
                      View last transaction
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
