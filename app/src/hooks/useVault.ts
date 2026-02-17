"use client";

import { useRef, useCallback } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { VAULT_ABI, ERC20_ABI } from "@/lib/contracts";

export function useVault(vaultAddress: `0x${string}` | undefined) {
  const { address } = useAccount();
  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Read: total assets in vault (refresh every 30s to reflect yield)
  const { data: totalAssets } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: "totalAssets",
    query: { enabled: !!vaultAddress, refetchInterval: 30_000 },
  });

  // Read: user's share balance
  const { data: shareBalance } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!vaultAddress, refetchInterval: 30_000 },
  });

  // Read: convert user's shares to assets (their actual value)
  const { data: userAssets } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: "convertToAssets",
    args: shareBalance ? [shareBalance] : undefined,
    query: { enabled: shareBalance !== undefined, refetchInterval: 30_000 },
  });

  // Read: deposit cap
  const { data: depositCap } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: "depositCap",
    query: { enabled: !!vaultAddress },
  });

  // Read: max deposit for user
  const { data: maxDeposit } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: "maxDeposit",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!vaultAddress },
  });

  // Write: deposit
  const deposit = (assets: bigint) => {
    if (!vaultAddress || !address) return;
    writeContract({
      address: vaultAddress,
      abi: VAULT_ABI,
      functionName: "deposit",
      args: [assets, address],
    });
  };

  // Write: withdraw
  const withdraw = (assets: bigint) => {
    if (!vaultAddress || !address) return;
    writeContract({
      address: vaultAddress,
      abi: VAULT_ABI,
      functionName: "withdraw",
      args: [assets, address, address],
    });
  };

  // Write: redeem (by shares)
  const redeem = (shares: bigint) => {
    if (!vaultAddress || !address) return;
    writeContract({
      address: vaultAddress,
      abi: VAULT_ABI,
      functionName: "redeem",
      args: [shares, address, address],
    });
  };

  return {
    // Read
    totalAssets: totalAssets as bigint | undefined,
    shareBalance: shareBalance as bigint | undefined,
    userAssets: userAssets as bigint | undefined,
    depositCap: depositCap as bigint | undefined,
    maxDeposit: maxDeposit as bigint | undefined,

    // Write
    deposit,
    withdraw,
    redeem,

    // Transaction state
    txHash,
    isPending,
    isConfirming,
    isSuccess,
    error: error || receiptError, // Combine write errors + receipt errors
    isReceiptError,
  };
}

// Hook for ERC20 approval flow
export function useApproval(tokenAddress: `0x${string}` | undefined, spender: `0x${string}` | undefined) {
  const { address } = useAccount();
  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  // Stabilize writeContract reference to prevent useEffect dependency loops
  const writeContractRef = useRef(writeContract);
  writeContractRef.current = writeContract;

  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const { data: allowance, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address && spender ? [address, spender] : undefined,
    query: { enabled: !!address && !!tokenAddress && !!spender },
  });

  const approve = useCallback((amount: bigint) => {
    if (!tokenAddress || !spender) return;
    writeContractRef.current({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [spender, amount],
    });
  }, [tokenAddress, spender]);

  const needsApproval = useCallback((amount: bigint) => {
    if (!allowance) return true;
    return (allowance as bigint) < amount;
  }, [allowance]);

  return {
    allowance: allowance as bigint | undefined,
    approve,
    needsApproval,
    refetchAllowance: refetch,
    isPending,
    isConfirming,
    isSuccess,
    error: error || receiptError, // Combine write errors + receipt errors
    isReceiptError,
  };
}
