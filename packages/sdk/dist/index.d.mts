import { Address, PublicClient } from 'viem';

declare const MONAD_CHAIN_ID = 143;
declare const CONTRACTS: {
    readonly looperLite: Address;
    readonly lendingAggregator: Address;
    readonly neverlendAdapter: Address;
    readonly maceAdapter: Address;
};
declare const PROTOCOLS: {
    readonly euler: {
        readonly name: "Euler V2";
        readonly evc: Address;
    };
    readonly curvance: {
        readonly name: "Curvance";
        readonly comptroller: Address;
    };
    readonly neverlend: {
        readonly name: "Neverlend";
        readonly lendingPool: Address;
    };
    readonly morpho: {
        readonly name: "Morpho";
        readonly morphoBlue: Address;
    };
};
declare const TOKENS: {
    readonly WMON: Address;
    readonly USDC: Address;
};
interface LendingRate {
    protocol: string;
    supplyAPY: number;
    borrowAPY: number;
    available: bigint;
}
interface Position {
    id: bigint;
    owner: Address;
    collateral: Address;
    debt: Address;
    collateralAmount: bigint;
    debtAmount: bigint;
    leverage: bigint;
    active: boolean;
}
interface RecursaConfig {
    rpcUrl?: string;
}
declare class RecursaSDK {
    private client;
    constructor(config?: RecursaConfig);
    /**
     * Get lending rates across all protocols for a given asset
     */
    getRates(asset: Address): Promise<LendingRate[]>;
    /**
     * Find the best rate for a given action
     */
    getBestRate(asset: Address, action: 'supply' | 'borrow'): Promise<LendingRate | null>;
    /**
     * Get a position by ID
     */
    getPosition(positionId: bigint): Promise<Position | null>;
    /**
     * Get all positions for a user
     */
    getUserPositions(user: Address): Promise<bigint[]>;
    /**
     * Get health factor for a position
     */
    getHealthFactor(positionId: bigint): Promise<bigint>;
    /**
     * Check if an asset is whitelisted
     */
    isAssetWhitelisted(asset: Address): Promise<boolean>;
    /**
     * Get the RPC client for advanced usage
     */
    getClient(): PublicClient;
}

export { CONTRACTS, type LendingRate, MONAD_CHAIN_ID, PROTOCOLS, type Position, type RecursaConfig, RecursaSDK, TOKENS, RecursaSDK as default };
