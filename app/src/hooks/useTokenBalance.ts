"use client";

import { useReadContract, useAccount } from "wagmi";
import { ERC20_ABI } from "@/lib/contracts";
import { formatUnits } from "viem";

export function useTokenBalance(tokenAddress: `0x${string}` | undefined) {
  const { address } = useAccount();

  const { data: rawBalance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!tokenAddress },
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "decimals",
    query: { enabled: !!tokenAddress },
  });

  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "symbol",
    query: { enabled: !!tokenAddress },
  });

  const formatted = rawBalance !== undefined && decimals !== undefined
    ? formatUnits(rawBalance, decimals)
    : undefined;

  return {
    raw: rawBalance,
    formatted,
    decimals: decimals as number | undefined,
    symbol: symbol as string | undefined,
  };
}
