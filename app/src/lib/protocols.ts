// Protocol contract addresses on Monad Mainnet (Chain ID: 143)

export const MONAD_CHAIN_ID = 143;

export const PROTOCOLS = {
  euler: {
    name: "Euler V2",
    logo: "🔷",
    contracts: {
      // EVC or core contracts
      evc: "0x7a9324E8f270413fa2E458f5831226d99C7477CD" as `0x${string}`,
      vaultFactory: "0x831257BFa5478111d2327e08c4068ec37Ac14B81" as `0x${string}`,
      oracle: "0xba4Dd672062dE8FeeDb665DD4410658864483f1E" as `0x${string}`,
    },
  },
  curvance: {
    name: "Curvance",
    logo: "🔶",
    contracts: {
      // Core contracts
      comptroller: "0xE01d426B589c7834a5F6B20D7e992A705d3c22ED" as `0x${string}`,
      marketManager: "0xAd4AA2a713fB86FBb6b60dE2aF9E32a11DB6Abf2" as `0x${string}`,
      priceRouter: "0xF32B334042DC1EB9732454cc9bc1a06205d184f2" as `0x${string}`,
      cToken1: "0x852FF1EC21D63b405eC431e04AE3AC760e29263D" as `0x${string}`,
      cToken2: "0x1e240E30E51491546deC3aF16B0b4EAC8Dd110D4" as `0x${string}`,
    },
  },
  neverlend: {
    name: "Neverlend",
    logo: "🌙",
    contracts: {
      // Core lending pool contracts
      lendingPool: "0x80F00661b13CC5F6ccd3885bE7b4C9c67545D585" as `0x${string}`,
      poolAddressProvider: "0x57ea245cCbFAb074baBb9d01d1F0c60525E52cec" as `0x${string}`,
      dataProvider: "0x800409dBd7157813BB76501c30e04596Cc478f25" as `0x${string}`,
      oracle: "0xBB4738D05AD1b3Da57a4881baE62Ce9bb1eEeD6C" as `0x${string}`,
      aToken1: "0xAD96C3dffCD6374294e2573A7fBBA96097CC8d7c" as `0x${string}`,
      aToken2: "0x3acA285b9F57832fF55f1e6835966890845c1526" as `0x${string}`,
      aToken3: "0x38648958836eA88b368b4ac23b86Ad44B0fe7508" as `0x${string}`,
      aToken4: "0x784999fc2Dd132a41D1Cc0F1aE9805854BaD1f2D" as `0x${string}`,
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
