"use client";

import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from "wagmi";
import { monad } from "@/lib/chains";

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const { data: balance } = useBalance({
    address,
  });

  const isCorrectChain = chainId === monad.id;

  const connectWallet = () => {
    // Prefer injected (MetaMask, Rabby, etc.)
    const injected = connectors.find((c) => c.id === "injected");
    const connector = injected || connectors[0];
    if (connector) {
      connect(
        { connector, chainId: monad.id },
        {
          onSuccess: () => {
            // Force switch to Monad after connecting
            if (chainId !== monad.id) {
              switchChain({ chainId: monad.id });
            }
          },
        }
      );
    }
  };

  const switchToMonad = () => {
    switchChain({ chainId: monad.id });
  };

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  return {
    address,
    shortAddress,
    isConnected,
    isConnecting,
    isCorrectChain,
    isSwitching,
    balance,
    connectWallet,
    switchToMonad,
    disconnect,
    connectors,
    connect,
  };
}
