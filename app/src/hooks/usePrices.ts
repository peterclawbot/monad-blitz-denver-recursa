"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Pyth Hermes price feed IDs (mainnet feeds work for price display)
const PYTH_FEED_IDS: Record<string, string> = {
  WETH: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  ETH: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  WBTC: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  BTC: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  USDC: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
  USDT: "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
};

const PYTH_HERMES_URL = "https://hermes.pyth.network/v2/updates/price/latest";
const POLL_INTERVAL_MS = 30_000; // 30 seconds

// Map from feed ID to symbol for reverse lookup
const FEED_ID_TO_SYMBOLS: Record<string, string[]> = {};
for (const [symbol, feedId] of Object.entries(PYTH_FEED_IDS)) {
  if (!FEED_ID_TO_SYMBOLS[feedId]) FEED_ID_TO_SYMBOLS[feedId] = [];
  FEED_ID_TO_SYMBOLS[feedId].push(symbol);
}

// Deduplicated feed IDs
const UNIQUE_FEED_IDS = [...new Set(Object.values(PYTH_FEED_IDS))];

interface PythPriceData {
  id: string;
  price: {
    price: string;
    expo: number;
    conf: string;
    publish_time: number;
  };
}

/**
 * Fetches real-time prices from Pyth Hermes API.
 * Returns a Record<string, number> mapping token symbol → USD price.
 * MON has no Pyth feed — uses $1.00 placeholder.
 * Polls every 30 seconds.
 */
export function usePrices(): {
  prices: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [prices, setPrices] = useState<Record<string, number>>({
    MON: 1.0, // No Pyth feed, placeholder
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      for (const id of UNIQUE_FEED_IDS) {
        params.append("ids[]", id);
      }

      const response = await fetch(`${PYTH_HERMES_URL}?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Pyth API error: ${response.status}`);
      }

      const data = await response.json();
      const parsed: PythPriceData[] = data.parsed ?? [];

      const newPrices: Record<string, number> = { MON: 1.0 };

      for (const item of parsed) {
        const feedId = "0x" + item.id;
        const symbols = FEED_ID_TO_SYMBOLS[feedId];
        if (!symbols) continue;

        const price = Number(item.price.price) * Math.pow(10, item.price.expo);
        for (const symbol of symbols) {
          newPrices[symbol] = price;
        }
      }

      setPrices(newPrices);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch prices");
      // Keep stale prices on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    intervalRef.current = setInterval(fetchPrices, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchPrices]);

  return { prices, isLoading, error, refetch: fetchPrices };
}

/**
 * Get a single token price from the prices map.
 * Returns undefined if not available.
 */
export function getPrice(prices: Record<string, number>, symbol: string): number | undefined {
  return prices[symbol] ?? prices[symbol.toUpperCase()];
}
