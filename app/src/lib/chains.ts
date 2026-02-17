import { defineChain } from "viem";

// Monad Mainnet (chain ID 143)
export const monad = defineChain({
  id: 143,
  name: "Monad",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://monad.drpc.org", "https://marty.machines.mace.ag/monad-rpc/VZNrFDixjeSB4qEMBk9fxJynIn/"],
    },
  },
  blockExplorers: {
    default: {
      name: "MonadVision",
      url: "https://monadvision.com",
    },
  },
  testnet: false,
});

// Alias for clarity
export const monadMainnet = monad;

// Testnet config (for reference)
export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.monad.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: "https://testnet.monadexplorer.com",
    },
  },
  testnet: true,
});
