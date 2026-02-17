// ═══════════════════════════════════════════════════════════════
// Token metadata and helpers
// ═══════════════════════════════════════════════════════════════

import { CONTRACTS } from "./contracts";
import type { Address } from "./deployments";

export interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
  address: Address;
}

export const TOKEN_LIST: TokenInfo[] = [
  { symbol: "WETH", name: "Wrapped ETH", decimals: 18, address: CONTRACTS.tokens.WETH },
  { symbol: "USDC", name: "USD Coin", decimals: 6, address: CONTRACTS.tokens.USDC },
  { symbol: "USDT", name: "Tether USD", decimals: 6, address: CONTRACTS.tokens.USDT },
  { symbol: "WBTC", name: "Wrapped BTC", decimals: 8, address: CONTRACTS.tokens.WBTC },
  { symbol: "MON", name: "Monad", decimals: 18, address: CONTRACTS.tokens.MON },
];

export const TOKEN_SYMBOLS = TOKEN_LIST.map((t) => t.symbol);

/** Map UI token name to address */
export function getTokenAddress(symbol: string): Address {
  // "ETH" maps to WETH
  if (symbol === "ETH") return CONTRACTS.tokens.WETH;
  const token = TOKEN_LIST.find((t) => t.symbol === symbol);
  return token?.address ?? CONTRACTS.tokens.WETH;
}

/** Map UI token name to decimals */
export function getTokenDecimals(symbol: string): number {
  if (symbol === "ETH") return 18;
  const token = TOKEN_LIST.find((t) => t.symbol === symbol);
  return token?.decimals ?? 18;
}

/** Get the debt asset for a given collateral token.
 *  @param collateralSymbol - The collateral token symbol.
 *  @param crossAsset - If true, uses a different borrow asset (higher risk).
 *                       Defaults to false (same-asset looping, safer). MEDIUM-01 FIX.
 */
export function getDebtAsset(
  collateralSymbol: string,
  crossAsset: boolean = false,
): { symbol: string; address: Address } {
  // MEDIUM-01: Default to same-asset looping (safer)
  if (!crossAsset) {
    const token = TOKEN_LIST.find((t) => t.symbol === collateralSymbol);
    return {
      symbol: collateralSymbol,
      address: token?.address ?? CONTRACTS.tokens.WETH,
    };
  }
  // Cross-asset mode: stablecoins borrow WETH, everything else borrows USDC
  const stables = ["USDC", "USDT"];
  if (stables.includes(collateralSymbol)) {
    return { symbol: "WETH", address: CONTRACTS.tokens.WETH };
  }
  return { symbol: "USDC", address: CONTRACTS.tokens.USDC };
}

/** Get token symbol from address */
export function getTokenSymbol(address: Address): string {
  const token = TOKEN_LIST.find(
    (t) => t.address.toLowerCase() === address.toLowerCase()
  );
  return token?.symbol ?? "???";
}

/** Get token info from address */
export function getTokenInfo(address: Address): TokenInfo | undefined {
  return TOKEN_LIST.find(
    (t) => t.address.toLowerCase() === address.toLowerCase()
  );
}

/** Mintable tokens on testnet (all mock tokens) */
export const MINTABLE_TOKENS = [
  { symbol: "USDC", address: CONTRACTS.tokens.USDC, amount: "10000", decimals: 6 },
  { symbol: "USDT", address: CONTRACTS.tokens.USDT, amount: "10000", decimals: 6 },
  { symbol: "WETH", address: CONTRACTS.tokens.WETH, amount: "10", decimals: 18 },
  { symbol: "WBTC", address: CONTRACTS.tokens.WBTC, amount: "1", decimals: 8 },
  { symbol: "MON", address: CONTRACTS.tokens.MON, amount: "1000", decimals: 18 },
];
