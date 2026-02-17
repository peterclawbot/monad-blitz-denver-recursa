"use client";

import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACTS, LOOPER_ABI } from "@/lib/contracts";
import { getTokenInfo } from "@/lib/tokens";
import type { Address } from "@/lib/deployments";

type PositionData = {
  owner: Address;
  proxy: Address;
  collateralAsset: Address;
  debtAsset: Address;
  lendingAdapter: Address;
  dexAdapter: Address;
  initialCollateral: bigint;
  totalCollateral: bigint;
  totalDebt: bigint;
  targetLeverage: bigint;
  initialHealthFactor: bigint;
  rebalanceRatioAtCreation: bigint;
  emergencyRatioAtCreation: bigint;
  createdAt: bigint;
  active: boolean;
};

export type PositionsSummary = {
  /** Number of active loop positions */
  activeCount: number;
  /** Total initial collateral deposited (formatted, grouped by token symbol) */
  collateralByToken: Record<string, number>;
  /** Average health factor across active positions (1e18 scaled → float) */
  avgHealthFactor: number | null;
  /** Average leverage across active positions */
  avgLeverage: number | null;
  /** Min health factor (the most at-risk position) */
  minHealthFactor: number | null;
  /** Whether data is still loading */
  isLoading: boolean;
};

/**
 * Batch-reads all positions + health factors for the given IDs
 * and returns aggregated summary stats.
 */
export function usePositionsSummary(positionIds: bigint[] | undefined): PositionsSummary {
  const ids = positionIds ?? [];

  // Build batch calls: getPosition + getHealthFactor for each ID
  const contracts = useMemo(() => {
    if (ids.length === 0) return [];
    return ids.flatMap((id) => [
      {
        address: CONTRACTS.looper as `0x${string}`,
        abi: LOOPER_ABI,
        functionName: "getPosition" as const,
        args: [id] as const,
      },
      {
        address: CONTRACTS.looper as `0x${string}`,
        abi: LOOPER_ABI,
        functionName: "getHealthFactor" as const,
        args: [id] as const,
      },
    ]);
  }, [ids]);

  const { data: results, isLoading } = useReadContracts({
    contracts,
    query: { enabled: ids.length > 0 },
  });

  const summary = useMemo<Omit<PositionsSummary, "isLoading">>(() => {
    const empty = {
      activeCount: 0,
      collateralByToken: {},
      avgHealthFactor: null,
      avgLeverage: null,
      minHealthFactor: null,
    };

    if (!results || results.length === 0) return empty;

    let activeCount = 0;
    let totalLeverage = 0;
    let totalHf = 0;
    let minHf = Infinity;
    const collateralByToken: Record<string, number> = {};

    for (let i = 0; i < ids.length; i++) {
      const posResult = results[i * 2];
      const hfResult = results[i * 2 + 1];

      if (posResult.status !== "success" || !posResult.result) continue;
      const pos = posResult.result as unknown as PositionData;

      if (!pos.active) continue;
      activeCount++;

      // Collateral
      const tokenInfo = getTokenInfo(pos.collateralAsset);
      const decimals = tokenInfo?.decimals ?? 18;
      const symbol = tokenInfo?.symbol ?? "???";
      const collateral = Number(formatUnits(pos.totalCollateral, decimals));
      collateralByToken[symbol] = (collateralByToken[symbol] ?? 0) + collateral;

      // Leverage
      const lev = Number(formatUnits(pos.targetLeverage, 18));
      totalLeverage += lev;

      // Health factor
      if (hfResult.status === "success" && hfResult.result) {
        const hf = Number(formatUnits(hfResult.result as bigint, 18));
        totalHf += hf;
        if (hf < minHf) minHf = hf;
      }
    }

    return {
      activeCount,
      collateralByToken,
      avgHealthFactor: activeCount > 0 ? totalHf / activeCount : null,
      avgLeverage: activeCount > 0 ? totalLeverage / activeCount : null,
      minHealthFactor: minHf === Infinity ? null : minHf,
    };
  }, [results, ids]);

  return { ...summary, isLoading };
}
