// ═══════════════════════════════════════════════════════════════
// Monad Testnet Explorer Helpers
// ═══════════════════════════════════════════════════════════════

const EXPLORER_BASE = "https://monadvision.com";

export function getExplorerTxUrl(hash: string): string {
  return `${EXPLORER_BASE}/tx/${hash}`;
}

export function getExplorerAddressUrl(address: string): string {
  return `${EXPLORER_BASE}/address/${address}`;
}

export function getExplorerBlockUrl(block: number | string): string {
  return `${EXPLORER_BASE}/block/${block}`;
}

export function shortenHash(hash: string, chars = 6): string {
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
