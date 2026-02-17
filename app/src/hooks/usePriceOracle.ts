"use client";

import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACTS, MOCK_PRICE_ORACLE_ABI } from "@/lib/contracts";
import { TOKEN_LIST } from "@/lib/tokens";

/**
 * Reads prices from the on-chain MockPriceOracle for chain-consistent values.
 * Returns a Record<string, number> mapping token symbol → USD price (float).
 * Prices on-chain are 1e18 scaled (e.g., 2000e18 = $2000).
 */
export function usePriceOracle(): {
  prices: Record<string, number>;
  isLoading: boolean;
} {
  const contracts = useMemo(() => {
    return TOKEN_LIST.map((token) => ({
      address: CONTRACTS.mocks.priceOracle as `0x${string}`,
      abi: MOCK_PRICE_ORACLE_ABI,
      functionName: "getPrice" as const,
      args: [token.address] as const,
    }));
  }, []);

  const { data: results, isLoading } = useReadContracts({
    contracts,
    query: {
      // Refetch every 60 seconds
      refetchInterval: 60_000,
    },
  });

  const prices = useMemo(() => {
    const map: Record<string, number> = {};

    if (!results) return map;

    for (let i = 0; i < TOKEN_LIST.length; i++) {
      const result = results[i];
      if (result.status === "success" && result.result) {
        const price = Number(formatUnits(result.result as bigint, 18));
        map[TOKEN_LIST[i].symbol] = price;
      }
    }

    return map;
  }, [results]);

  return { prices, isLoading };
}
