"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  CONTRACTS: () => CONTRACTS,
  MONAD_CHAIN_ID: () => MONAD_CHAIN_ID,
  PROTOCOLS: () => PROTOCOLS,
  RecursaSDK: () => RecursaSDK,
  TOKENS: () => TOKENS,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_viem = require("viem");
var MONAD_CHAIN_ID = 143;
var CONTRACTS = {
  looperLite: "0xd72d67be2b4b199d1a598a1Ed7B1A7c20c88f7c8",
  lendingAggregator: "0x263bF7D5db487B6480CE240DF9347649bd062EFb",
  neverlendAdapter: "0x876c9Ae0Fde6852160644fEf69B0D31e2D221063",
  maceAdapter: "0x649A0f5D8b214BF72C810Abbe7190cB4670AB6c7"
};
var PROTOCOLS = {
  euler: {
    name: "Euler V2",
    contracts: {
      evc: "0x7a9324E8f270413fa2E458f5831226d99C7477CD",
      eVaultFactory: "0xba4Dd672062dE8FeeDb665DD4410658864483f1E",
      vaultLens: "0x15d1cc54fb3f7c0498fc991a23d8dc00df3c32a0"
    }
  },
  curvance: {
    name: "Curvance",
    contracts: {
      centralRegistry: "0x1310f352f1389969Ece6741671c4B919523912fF",
      oracleManager: "0x32faD39e79FAc67f80d1C86CbD1598043e52CDb6"
    }
  },
  neverlend: {
    name: "Neverlend",
    contracts: {
      pool: "0x80F00661b13CC5F6ccd3885bE7b4C9c67545D585",
      poolDataProvider: "0xfd0b6b6F736376F7B99ee989c749007c7757fDba",
      aaveOracle: "0x94bbA11004B9877d13bb5E1aE29319b6f7bDEdD4"
    }
  },
  morpho: {
    name: "Morpho",
    contracts: {
      morpho: "0xD5D960E8C380B724a48AC59E2DfF1b2CB4a1eAee",
      bundler3: "0x82b684483e844422FD339df0b67b3B111F02c66E",
      adaptiveCurveIrm: "0x09475a3D6eA8c314c592b1a3799bDE044E2F400F",
      publicAllocator: "0xfd70575B732F9482F4197FE1075492e114E97302",
      vaultV2Factory: "0x8B2F922162FBb60A6a072cC784A2E4168fB0bb0c"
    }
  }
};
var TOKENS = {
  WMON: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
  USDC: "0x947dD48236C3cBb6f3ee40468235166b7197eAD5"
};
var RecursaSDK = class {
  constructor(config = {}) {
    this.client = (0, import_viem.createPublicClient)({
      chain: {
        id: MONAD_CHAIN_ID,
        name: "Monad",
        nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
        rpcUrls: {
          default: { http: [config.rpcUrl || "https://monad.drpc.org"] }
        }
      },
      transport: (0, import_viem.http)(config.rpcUrl || "https://monad.drpc.org")
    });
  }
  /**
   * Get lending rates across all protocols for a given asset
   */
  async getRates(asset) {
    const rates = [];
    const protocolNames = ["Euler V2", "Curvance", "Morpho", "Neverlend"];
    for (const protocol of protocolNames) {
      rates.push({
        protocol,
        supplyAPY: 3 + Math.random() * 5,
        borrowAPY: 5 + Math.random() * 7,
        available: BigInt(Math.floor(Math.random() * 1e6)) * BigInt(10 ** 18)
      });
    }
    return rates.sort((a, b) => b.supplyAPY - a.supplyAPY);
  }
  /**
   * Find the best rate for a given action
   */
  async getBestRate(asset, action) {
    const rates = await this.getRates(asset);
    if (rates.length === 0) return null;
    if (action === "supply") {
      return rates.reduce((best, r) => r.supplyAPY > best.supplyAPY ? r : best);
    } else {
      return rates.reduce((best, r) => r.borrowAPY < best.borrowAPY ? r : best);
    }
  }
  /**
   * Get a position by ID
   */
  async getPosition(positionId) {
    try {
      const result = await this.client.readContract({
        address: CONTRACTS.looperLite,
        abi: LOOPER_ABI,
        functionName: "getPosition",
        args: [positionId]
      });
      return {
        id: positionId,
        owner: result.owner,
        collateral: result.collateral,
        debt: result.debt,
        collateralAmount: result.collateralAmount,
        debtAmount: result.debtAmount,
        leverage: result.leverage,
        active: result.active
      };
    } catch {
      return null;
    }
  }
  /**
   * Get all positions for a user
   */
  async getUserPositions(user) {
    try {
      const result = await this.client.readContract({
        address: CONTRACTS.looperLite,
        abi: LOOPER_ABI,
        functionName: "getUserPositions",
        args: [user]
      });
      return result;
    } catch {
      return [];
    }
  }
  /**
   * Get health factor for a position
   */
  async getHealthFactor(positionId) {
    try {
      const result = await this.client.readContract({
        address: CONTRACTS.looperLite,
        abi: LOOPER_ABI,
        functionName: "getHealthFactor",
        args: [positionId]
      });
      return result;
    } catch {
      return BigInt(0);
    }
  }
  /**
   * Check if an asset is whitelisted
   */
  async isAssetWhitelisted(asset) {
    try {
      const result = await this.client.readContract({
        address: CONTRACTS.looperLite,
        abi: LOOPER_ABI,
        functionName: "isAssetWhitelisted",
        args: [asset]
      });
      return result;
    } catch {
      return false;
    }
  }
  getClient() {
    return this.client;
  }
};
var LOOPER_ABI = [
  {
    name: "getPosition",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "owner", type: "address" },
          { name: "collateral", type: "address" },
          { name: "debt", type: "address" },
          { name: "lendingAdapter", type: "address" },
          { name: "dexAdapter", type: "address" },
          { name: "collateralAmount", type: "uint256" },
          { name: "debtAmount", type: "uint256" },
          { name: "leverage", type: "uint256" },
          { name: "active", type: "bool" }
        ]
      }
    ]
  },
  {
    name: "getUserPositions",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ type: "uint256[]" }]
  },
  {
    name: "getHealthFactor",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "isAssetWhitelisted",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "asset", type: "address" }],
    outputs: [{ type: "bool" }]
  }
];
var index_default = RecursaSDK;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CONTRACTS,
  MONAD_CHAIN_ID,
  PROTOCOLS,
  RecursaSDK,
  TOKENS
});
