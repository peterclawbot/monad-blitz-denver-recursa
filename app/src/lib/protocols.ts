// Protocol contract addresses on Monad Mainnet (Chain ID: 143)

export const MONAD_CHAIN_ID = 143;

export const PROTOCOLS = {
  euler: {
    name: "Euler V2",
    logo: "🔷",
    contracts: {
      // Euler Vault Kit (EVK) - official addresses
      evc: "0x7a9324E8f270413fa2E458f5831226d99C7477CD" as `0x${string}`,
      eVaultFactory: "0xba4Dd672062dE8FeeDb665DD4410658864483f1E" as `0x${string}`,
      vaultLens: "0x15d1cc54fb3f7c0498fc991a23d8dc00df3c32a0" as `0x${string}`,
    },
  },
  curvance: {
    name: "Curvance",
    logo: "🔶",
    contracts: {
      // Curvance (Compound-style) - official addresses
      centralRegistry: "0x1310f352f1389969Ece6741671c4B919523912fF" as `0x${string}`,
      oracleManager: "0x32faD39e79FAc67f80d1C86CbD1598043e52CDb6" as `0x${string}`,
      // Market managers vary per pair
    },
  },
  neverlend: {
    name: "Neverlend",
    logo: "🌙",
    contracts: {
      // Neverlend (Aave V3 fork) - official addresses
      pool: "0x80F00661b13CC5F6ccd3885bE7b4C9c67545D585" as `0x${string}`,
      poolDataProvider: "0xfd0b6b6F736376F7B99ee989c749007c7757fDba" as `0x${string}`,
      aaveOracle: "0x94bbA11004B9877d13bb5E1aE29319b6f7bDEdD4" as `0x${string}`,
    },
  },
  morpho: {
    name: "Morpho",
    logo: "🦋",
    contracts: {
      // Morpho Blue core (from John's official list)
      morpho: "0xD5D960E8C380B724a48AC59E2DfF1b2CB4a1eAee" as `0x${string}`,
      bundler3: "0x82b684483e844422FD339df0b67b3B111F02c66E" as `0x${string}`,
      adaptiveCurveIrm: "0x09475a3D6eA8c314c592b1a3799bDE044E2F400F" as `0x${string}`,
      publicAllocator: "0xfd70575B732F9482F4197FE1075492e114E97302" as `0x${string}`,
      metaMorphoFactory: "0x33f20973275B2F574488b18929cd7DCBf1AbF275" as `0x${string}`,
      oracleFactory: "0xC8659Bcd5279DB664Be973aEFd752a5326653739" as `0x${string}`,
      vaultV2Factory: "0x8B2F922162FBb60A6a072cC784A2E4168fB0bb0c" as `0x${string}`,
      preLiquidationFactory: "0xB5b3e541abD19799E0c65905a5a42BD37d6c94c0" as `0x${string}`,
      urdFactory: "0xE8233125be3ecD274b8007618315Dd2f3361eced" as `0x${string}`,
    },
  },
} as const;

// Helper to get all protocol names
export const PROTOCOL_NAMES = Object.keys(PROTOCOLS) as Array<keyof typeof PROTOCOLS>;

// Helper to get protocol by name
export function getProtocol(name: keyof typeof PROTOCOLS) {
  return PROTOCOLS[name];
}

// Export individual protocol addresses for direct imports
export const EULER_CONTRACTS = PROTOCOLS.euler.contracts;
export const CURVANCE_CONTRACTS = PROTOCOLS.curvance.contracts;
export const NEVERLEND_CONTRACTS = PROTOCOLS.neverlend.contracts;
export const MORPHO_CONTRACTS = PROTOCOLS.morpho.contracts;
