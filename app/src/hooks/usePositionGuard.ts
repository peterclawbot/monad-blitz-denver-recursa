"use client";

import { useRef, useCallback } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { POSITION_GUARD_ABI } from "@/lib/abis/positionGuard";
import { CONTRACTS } from "@/lib/contracts";

// Address will be populated after deployment
const GUARD_ADDRESS = (CONTRACTS as Record<string, unknown>).positionGuard as `0x${string}` | undefined;

type GuardConfig = {
  stopLossEnabled: boolean;
  stopLossHF: bigint;
  takeProfitEnabled: boolean;
  takeProfitBps: bigint;
  trailingStopEnabled: boolean;
  trailingStopBps: bigint;
  peakCollateral: bigint;
};

/**
 * Hook for reading and writing PositionGuard config (stop-loss, take-profit, trailing stop).
 */
export function usePositionGuard(positionId: bigint | undefined) {
  const { address } = useAccount();
  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const writeContractRef = useRef(writeContract);
  writeContractRef.current = writeContract;

  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Read guard config for this position
  const { data: guardConfig, refetch: refetchGuard } = useReadContract({
    address: GUARD_ADDRESS,
    abi: POSITION_GUARD_ABI,
    functionName: "getGuardConfig",
    args: positionId !== undefined ? [positionId] : undefined,
    query: { enabled: positionId !== undefined && !!GUARD_ADDRESS },
  });

  // ── Stop-Loss ──
  const setStopLoss = useCallback((posId: bigint, healthFactorThreshold: bigint, maxSlippage: bigint) => {
    if (!GUARD_ADDRESS) return;
    writeContractRef.current({
      address: GUARD_ADDRESS,
      abi: POSITION_GUARD_ABI,
      functionName: "setStopLoss",
      args: [posId, healthFactorThreshold, maxSlippage],
    });
  }, []);

  const removeStopLoss = useCallback((posId: bigint) => {
    if (!GUARD_ADDRESS) return;
    writeContractRef.current({
      address: GUARD_ADDRESS,
      abi: POSITION_GUARD_ABI,
      functionName: "removeStopLoss",
      args: [posId],
    });
  }, []);

  // ── Take-Profit ──
  const setTakeProfit = useCallback((posId: bigint, profitTargetBps: bigint, maxSlippage: bigint) => {
    if (!GUARD_ADDRESS) return;
    writeContractRef.current({
      address: GUARD_ADDRESS,
      abi: POSITION_GUARD_ABI,
      functionName: "setTakeProfit",
      args: [posId, profitTargetBps, maxSlippage],
    });
  }, []);

  const removeTakeProfit = useCallback((posId: bigint) => {
    if (!GUARD_ADDRESS) return;
    writeContractRef.current({
      address: GUARD_ADDRESS,
      abi: POSITION_GUARD_ABI,
      functionName: "removeTakeProfit",
      args: [posId],
    });
  }, []);

  // ── Trailing Stop ──
  const setTrailingStop = useCallback((posId: bigint, trailBps: bigint, maxSlippage: bigint) => {
    if (!GUARD_ADDRESS) return;
    writeContractRef.current({
      address: GUARD_ADDRESS,
      abi: POSITION_GUARD_ABI,
      functionName: "setTrailingStop",
      args: [posId, trailBps, maxSlippage],
    });
  }, []);

  const removeTrailingStop = useCallback((posId: bigint) => {
    if (!GUARD_ADDRESS) return;
    writeContractRef.current({
      address: GUARD_ADDRESS,
      abi: POSITION_GUARD_ABI,
      functionName: "removeTrailingStop",
      args: [posId],
    });
  }, []);

  const config = guardConfig as GuardConfig | undefined;

  return {
    // Read
    guardConfig: config,
    isGuardDeployed: !!GUARD_ADDRESS,
    refetchGuard,

    // Stop-Loss
    setStopLoss,
    removeStopLoss,

    // Take-Profit
    setTakeProfit,
    removeTakeProfit,

    // Trailing Stop
    setTrailingStop,
    removeTrailingStop,

    // Tx state
    txHash,
    isPending,
    isConfirming,
    isSuccess,
    error: error || receiptError, // Combine write errors + receipt errors
    isReceiptError,
  };
}
