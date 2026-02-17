import { http, createConfig } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { monad } from "./chains";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "recursa-dev";

export const wagmiConfig = createConfig({
  chains: [monad],
  connectors: [
    injected({
      // Force wallet to switch to Monad on connect
      shimDisconnect: true,
    }),
    // WalletConnect for mobile wallets
    ...(projectId !== "recursa-dev"
      ? [walletConnect({ projectId })]
      : []),
  ],
  transports: {
    [monad.id]: http("https://monad.drpc.org", {
      fetchOptions: { cache: "no-store" },
      retryCount: 3,
      retryDelay: 1000,
    }),
  },
  // SSR-safe storage
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
