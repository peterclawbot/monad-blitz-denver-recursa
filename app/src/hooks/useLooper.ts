"use client";

import { useRef, useCallback } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { CONTRACTS, LOOPER_ABI, MOCK_LENDING_POOL_ABI } from "@/lib/contracts";
import { parseEther } from "viem";

export function useLooper() {
  const { address } = useAccount();
  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  // Stabilize writeContract reference to prevent useEffect dependency loops
  const writeContractRef = useRef(writeContract);
  writeContractRef.current = writeContract;

  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Read: get user's positions
  const { data: positionIds } = useReadContract({
    address: CONTRACTS.looper,
    abi: LOOPER_ABI,
    functionName: "getPositionsByOwner",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read: total positions protocol-wide
  const { data: totalPositions } = useReadContract({
    address: CONTRACTS.looper,
    abi: LOOPER_ABI,
    functionName: "totalPositions",
  });

  // Write: create a loop (stable reference via ref)
  const createLoop = useCallback((params: {
    collateralAsset: `0x${string}`;
    debtAsset: `0x${string}`;
    amount: bigint;
    targetLeverage: bigint;
    maxIterations: bigint;
    minHealthFactor: bigint;
    maxSlippage: bigint;
    lendingAdapter: `0x${string}`;
    dexAdapter: `0x${string}`;
  }) => {
    writeContractRef.current({
      address: CONTRACTS.looper,
      abi: LOOPER_ABI,
      functionName: "loop",
      args: [params],
    });
  }, []);

  // Write: close a loop (stable reference via ref)
  const closeLoop = useCallback((positionId: bigint, maxSlippage: bigint) => {
    writeContractRef.current({
      address: CONTRACTS.looper,
      abi: LOOPER_ABI,
      functionName: "unloop",
      args: [positionId, maxSlippage],
    });
  }, []);

  return {
    // Read
    positionIds: positionIds as bigint[] | undefined,
    totalPositions: totalPositions as bigint | undefined,

    // Write
    createLoop,
    closeLoop,

    // Transaction state
    txHash,
    isPending,
    isConfirming,
    isSuccess,
    error: error || receiptError, // Combine write errors + receipt errors
    isReceiptError,
  };
}

// Hook to read a single position's data with LIVE balances from the lending adapter
export function usePosition(positionId: bigint | undefined) {
  const { data: position } = useReadContract({
    address: CONTRACTS.looper,
    abi: LOOPER_ABI,
    functionName: "getPosition",
    args: positionId !== undefined ? [positionId] : undefined,
    query: { enabled: positionId !== undefined, refetchInterval: 30_000 },
  });

  const { data: healthFactor } = useReadContract({
    address: CONTRACTS.looper,
    abi: LOOPER_ABI,
    functionName: "getHealthFactor",
    args: positionId !== undefined ? [positionId] : undefined,
    query: { enabled: positionId !== undefined, refetchInterval: 30_000 },
  });

  // Extract proxy and asset addresses from the position struct
  const pos = position as {
    proxy: `0x${string}`;
    collateralAsset: `0x${string}`;
    debtAsset: `0x${string}`;
    lendingAdapter: `0x${string}`;
  } | undefined;

  // Read LIVE collateral balance from the lending adapter (not the stale struct value)
  const { data: liveCollateral } = useReadContract({
    address: pos?.lendingAdapter,
    abi: MOCK_LENDING_POOL_ABI,
    functionName: "getCollateralBalance",
    args: pos ? [pos.proxy, pos.collateralAsset] : undefined,
    query: {
      enabled: !!pos?.proxy,
      refetchInterval: 30_000, // Refresh every 30s to catch accrued interest
    },
  });

  // Read LIVE debt balance from the lending adapter
  const { data: liveDebt } = useReadContract({
    address: pos?.lendingAdapter,
    abi: MOCK_LENDING_POOL_ABI,
    functionName: "getDebtBalance",
    args: pos ? [pos.proxy, pos.debtAsset] : undefined,
    query: {
      enabled: !!pos?.proxy,
      refetchInterval: 30_000,
    },
  });

  return {
    position,
    healthFactor: healthFactor as bigint | undefined,
    liveCollateral: liveCollateral as bigint | undefined,
    liveDebt: liveDebt as bigint | undefined,
  };
}
