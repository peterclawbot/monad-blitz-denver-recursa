// RecursaZap ABI — any-token entry into loops and vaults
export const RECURSA_ZAP_ABI = [
  {
    name: "zapIntoLoop",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "inputToken", type: "address" },
      { name: "inputAmount", type: "uint256" },
      { name: "minCollateralOut", type: "uint256" },
      {
        name: "loopParams",
        type: "tuple",
        components: [
          { name: "collateralAsset", type: "address" },
          { name: "debtAsset", type: "address" },
          { name: "amount", type: "uint256" }, // ignored — replaced by swap output
          { name: "targetLeverage", type: "uint256" },
          { name: "maxIterations", type: "uint256" },
          { name: "minHealthFactor", type: "uint256" },
          { name: "maxSlippage", type: "uint256" },
          { name: "lendingAdapter", type: "address" },
          { name: "dexAdapter", type: "address" },
        ],
      },
    ],
    outputs: [{ name: "positionId", type: "uint256" }],
  },
  {
    name: "zapIntoVault",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "inputToken", type: "address" },
      { name: "inputAmount", type: "uint256" },
      { name: "minAssetOut", type: "uint256" },
      { name: "vault", type: "address" },
      { name: "dexAdapter", type: "address" },
    ],
    outputs: [{ name: "shares", type: "uint256" }],
  },
  {
    name: "getQuote",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "inputToken", type: "address" },
      { name: "outputToken", type: "address" },
      { name: "inputAmount", type: "uint256" },
      { name: "dexAdapter", type: "address" },
    ],
    outputs: [{ name: "outputAmount", type: "uint256" }],
  },
] as const;
