"use client";

import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACTS, MOCK_LENDING_POOL_ABI } from "@/lib/contracts";
import { TOKEN_LIST } from "@/lib/tokens";

export interface LendingRates {
  /** Symbol → supply APY as a percentage (e.g., 5.0 = 5%) */
  supplyAPY: Record<string, number>;
  /** Symbol → borrow APY as a percentage (e.g., 7.0 = 7%) */
  borrowAPY: Record<string, number>;
  isLoading: boolean;
}

/**
 * Reads supply and borrow APY rates from the on-chain MockLendingPool.
 * APY values on-chain are 1e18 scaled (0.05e18 = 5%).
 * Returns percentages (5.0 = 5%).
 */
export function useLendingRates(): LendingRates {
  const contracts = useMemo(() => {
    return TOKEN_LIST.flatMap((token) => [
      {
        address: CONTRACTS.adapters.lendingPool as `0x${string}`,
        abi: MOCK_LENDING_POOL_ABI,
        functionName: "getSupplyAPY" as const,
        args: [token.address] as const,
      },
      {
        address: CONTRACTS.adapters.lendingPool as `0x${string}`,
        abi: MOCK_LENDING_POOL_ABI,
        functionName: "getBorrowAPY" as const,
        args: [token.address] as const,
      },
    ]);
  }, []);

  const { data: results, isLoading } = useReadContracts({
    contracts,
    query: {
      refetchInterval: 60_000,
    },
  });

  const rates = useMemo(() => {
    const supplyAPY: Record<string, number> = {};
    const borrowAPY: Record<string, number> = {};

    if (!results) return { supplyAPY, borrowAPY };

    for (let i = 0; i < TOKEN_LIST.length; i++) {
      const supplyResult = results[i * 2];
      const borrowResult = results[i * 2 + 1];
      const symbol = TOKEN_LIST[i].symbol;

      if (supplyResult?.status === "success" && supplyResult.result) {
        // Convert from 1e18 scale to percentage: 0.05e18 → 5.0
        supplyAPY[symbol] = Number(formatUnits(supplyResult.result as bigint, 18)) * 100;
      }

      if (borrowResult?.status === "success" && borrowResult.result) {
        borrowAPY[symbol] = Number(formatUnits(borrowResult.result as bigint, 18)) * 100;
      }
    }

    return { supplyAPY, borrowAPY };
  }, [results]);

  return { ...rates, isLoading };
}
