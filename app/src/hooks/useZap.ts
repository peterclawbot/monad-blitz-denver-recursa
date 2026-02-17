"use client";

import { useRef, useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { RECURSA_ZAP_ABI } from "@/lib/abis/recursaZap";
import { CONTRACTS } from "@/lib/contracts";
// Address will be populated after deployment
const ZAP_ADDRESS = (CONTRACTS as Record<string, unknown>).zap as `0x${string}` | undefined;

/**
 * Hook for zapping any token into a loop or vault.
 */
export function useZap() {
  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const writeContractRef = useRef(writeContract);
  writeContractRef.current = writeContract;

  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const zapIntoLoop = useCallback((
    inputToken: `0x${string}`,
    inputAmount: bigint,
    minCollateralOut: bigint,
    loopParams: {
      collateralAsset: `0x${string}`;
      debtAsset: `0x${string}`;
      amount: bigint;
      targetLeverage: bigint;
      maxIterations: bigint;
      minHealthFactor: bigint;
      maxSlippage: bigint;
      lendingAdapter: `0x${string}`;
      dexAdapter: `0x${string}`;
    },
  ) => {
    if (!ZAP_ADDRESS) return;
    writeContractRef.current({
      address: ZAP_ADDRESS,
      abi: RECURSA_ZAP_ABI,
      functionName: "zapIntoLoop",
      args: [inputToken, inputAmount, minCollateralOut, loopParams],
    });
  }, []);

  const zapIntoVault = useCallback((
    inputToken: `0x${string}`,
    inputAmount: bigint,
    minAssetOut: bigint,
    vault: `0x${string}`,
    dexAdapter: `0x${string}`,
  ) => {
    if (!ZAP_ADDRESS) return;
    writeContractRef.current({
      address: ZAP_ADDRESS,
      abi: RECURSA_ZAP_ABI,
      functionName: "zapIntoVault",
      args: [inputToken, inputAmount, minAssetOut, vault, dexAdapter],
    });
  }, []);

  return {
    isZapDeployed: !!ZAP_ADDRESS,
    zapIntoLoop,
    zapIntoVault,
    txHash,
    isPending,
    isConfirming,
    isSuccess,
    error: error || receiptError, // Combine write errors + receipt errors
    isReceiptError,
  };
}
