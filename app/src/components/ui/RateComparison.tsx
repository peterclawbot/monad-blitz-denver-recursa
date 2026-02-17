"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Zap, RefreshCw, CheckCircle } from "lucide-react";

type Protocol = {
  name: string;
  supplyAPY: number;
  borrowAPY: number;
  tvl: string;
  logo: string;
};

type RateComparisonProps = {
  asset: string;
  onSelectProtocol?: (protocol: string, type: "supply" | "borrow") => void;
};

// Mock data - in production, this would come from the LendingAggregator contract
// Protocols: Euler V2, Curvance, Morpho, Neverlend on Monad mainnet
const MOCK_RATES: Record<string, Protocol[]> = {
  USDC: [
    { name: "Euler V2", supplyAPY: 4.2, borrowAPY: 5.8, tvl: "$12.4M", logo: "🔷" },
    { name: "Curvance", supplyAPY: 3.9, borrowAPY: 5.2, tvl: "$8.7M", logo: "🔶" },
    { name: "Morpho", supplyAPY: 4.5, borrowAPY: 5.4, tvl: "$18.2M", logo: "🦋" },
    { name: "Neverlend", supplyAPY: 4.1, borrowAPY: 5.6, tvl: "$6.3M", logo: "🌙" },
  ],
  USDT: [
    { name: "Euler V2", supplyAPY: 4.0, borrowAPY: 5.5, tvl: "$9.8M", logo: "🔷" },
    { name: "Curvance", supplyAPY: 4.3, borrowAPY: 5.9, tvl: "$6.2M", logo: "🔶" },
    { name: "Morpho", supplyAPY: 4.4, borrowAPY: 5.3, tvl: "$14.1M", logo: "🦋" },
    { name: "Neverlend", supplyAPY: 3.8, borrowAPY: 5.4, tvl: "$4.8M", logo: "🌙" },
  ],
  ETH: [
    { name: "Euler V2", supplyAPY: 2.8, borrowAPY: 4.2, tvl: "$45.2M", logo: "🔷" },
    { name: "Curvance", supplyAPY: 2.5, borrowAPY: 3.8, tvl: "$32.1M", logo: "🔶" },
    { name: "Morpho", supplyAPY: 3.1, borrowAPY: 4.0, tvl: "$52.8M", logo: "🦋" },
    { name: "Neverlend", supplyAPY: 2.6, borrowAPY: 4.1, tvl: "$21.4M", logo: "🌙" },
  ],
  WETH: [
    { name: "Euler V2", supplyAPY: 2.8, borrowAPY: 4.2, tvl: "$45.2M", logo: "🔷" },
    { name: "Curvance", supplyAPY: 2.5, borrowAPY: 3.8, tvl: "$32.1M", logo: "🔶" },
    { name: "Morpho", supplyAPY: 3.1, borrowAPY: 4.0, tvl: "$52.8M", logo: "🦋" },
    { name: "Neverlend", supplyAPY: 2.6, borrowAPY: 4.1, tvl: "$21.4M", logo: "🌙" },
  ],
  WBTC: [
    { name: "Euler V2", supplyAPY: 1.2, borrowAPY: 3.1, tvl: "$22.8M", logo: "🔷" },
    { name: "Curvance", supplyAPY: 1.0, borrowAPY: 2.8, tvl: "$15.4M", logo: "🔶" },
    { name: "Morpho", supplyAPY: 1.4, borrowAPY: 2.9, tvl: "$28.5M", logo: "🦋" },
    { name: "Neverlend", supplyAPY: 1.1, borrowAPY: 3.0, tvl: "$11.2M", logo: "🌙" },
  ],
  MON: [
    { name: "Euler V2", supplyAPY: 8.5, borrowAPY: 12.2, tvl: "$3.2M", logo: "🔷" },
    { name: "Curvance", supplyAPY: 7.8, borrowAPY: 11.5, tvl: "$2.1M", logo: "🔶" },
    { name: "Morpho", supplyAPY: 9.2, borrowAPY: 11.8, tvl: "$4.5M", logo: "🦋" },
    { name: "Neverlend", supplyAPY: 8.1, borrowAPY: 12.0, tvl: "$1.8M", logo: "🌙" },
  ],
  WMON: [
    { name: "Euler V2", supplyAPY: 8.2, borrowAPY: 11.8, tvl: "$2.8M", logo: "🔷" },
    { name: "Curvance", supplyAPY: 8.9, borrowAPY: 12.5, tvl: "$1.9M", logo: "🔶" },
    { name: "Morpho", supplyAPY: 9.0, borrowAPY: 11.6, tvl: "$3.9M", logo: "🦋" },
    { name: "Neverlend", supplyAPY: 7.9, borrowAPY: 11.9, tvl: "$1.5M", logo: "🌙" },
  ],
};

export function RateComparison({ asset, onSelectProtocol }: RateComparisonProps) {
  const [rates, setRates] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [bestSupply, setBestSupply] = useState<string>("");
  const [bestBorrow, setBestBorrow] = useState<string>("");

  useEffect(() => {
    // Simulate loading from contract
    setLoading(true);
    setTimeout(() => {
      const assetRates = MOCK_RATES[asset] || MOCK_RATES["USDC"];
      setRates(assetRates);

      // Find best rates
      const highestSupply = assetRates.reduce((best, p) =>
        p.supplyAPY > best.supplyAPY ? p : best
      );
      const lowestBorrow = assetRates.reduce((best, p) =>
        p.borrowAPY < best.borrowAPY ? p : best
      );

      setBestSupply(highestSupply.name);
      setBestBorrow(lowestBorrow.name);
      setLoading(false);
    }, 800);
  }, [asset]);

  if (loading) {
    return (
      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
        <div className="flex items-center justify-center gap-2 text-zinc-400">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Fetching rates from protocols...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="font-medium text-white">Rate Comparison — {asset}</span>
        </div>
        <span className="text-xs text-zinc-500">Live from aggregator</span>
      </div>

      {/* Optimal Strategy Banner */}
      <div className="px-4 py-3 bg-emerald-500/10 border-b border-emerald-500/20">
        <div className="flex items-center gap-2 text-emerald-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>
            Optimal: Supply on <strong>{bestSupply}</strong>, Borrow on{" "}
            <strong>{bestBorrow}</strong>
          </span>
        </div>
      </div>

      {/* Rate Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-zinc-500 border-b border-zinc-800">
              <th className="px-4 py-3 text-left font-medium">Protocol</th>
              <th className="px-4 py-3 text-right font-medium">
                <div className="flex items-center justify-end gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  Supply APY
                </div>
              </th>
              <th className="px-4 py-3 text-right font-medium">
                <div className="flex items-center justify-end gap-1">
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  Borrow APY
                </div>
              </th>
              <th className="px-4 py-3 text-right font-medium">TVL</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((protocol) => (
              <motion.tr
                key={protocol.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{protocol.logo}</span>
                    <span className="font-medium text-white">{protocol.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span
                      className={`font-mono ${
                        protocol.name === bestSupply
                          ? "text-emerald-400 font-semibold"
                          : "text-zinc-300"
                      }`}
                    >
                      {protocol.supplyAPY.toFixed(2)}%
                    </span>
                    {protocol.name === bestSupply && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        BEST
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span
                      className={`font-mono ${
                        protocol.name === bestBorrow
                          ? "text-emerald-400 font-semibold"
                          : "text-zinc-300"
                      }`}
                    >
                      {protocol.borrowAPY.toFixed(2)}%
                    </span>
                    {protocol.name === bestBorrow && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        BEST
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-zinc-400 font-mono text-sm">
                  {protocol.tvl}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with Aggregator Advantage */}
      <div className="px-4 py-3 bg-zinc-800/30 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-zinc-500">Rates update every block</span>
          <span className="text-zinc-500">
            Net spread:{" "}
            <span className="text-emerald-400 font-mono">
              {(
                rates.find((p) => p.name === bestSupply)?.supplyAPY! -
                rates.find((p) => p.name === bestBorrow)?.borrowAPY!
              ).toFixed(2)}
              %
            </span>
          </span>
        </div>
        
        {/* Aggregator Advantage Banner */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20"
        >
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-zinc-300">
            Aggregator saves you{" "}
            <span className="text-primary font-semibold">
              {(() => {
                const bestSupplyRate = rates.find((p) => p.name === bestSupply)?.supplyAPY ?? 0;
                const worstSupplyRate = Math.min(...rates.map((p) => p.supplyAPY));
                return (bestSupplyRate - worstSupplyRate).toFixed(1);
              })()}
              % APY
            </span>{" "}
            vs worst protocol
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
