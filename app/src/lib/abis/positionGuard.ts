// PositionGuard ABI — stop-loss, take-profit, trailing stop automation
export const POSITION_GUARD_ABI = [
  // ── User config functions ──
  {
    name: "setStopLoss",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "positionId", type: "uint256" },
      { name: "healthFactorThreshold", type: "uint256" },
      { name: "maxSlippage", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "removeStopLoss",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "setTakeProfit",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "positionId", type: "uint256" },
      { name: "profitTargetBps", type: "uint256" },
      { name: "maxSlippage", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "removeTakeProfit",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "setTrailingStop",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "positionId", type: "uint256" },
      { name: "trailBps", type: "uint256" },
      { name: "maxSlippage", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "removeTrailingStop",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [],
  },
  // ── View functions ──
  {
    name: "getStopLoss",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [
      { name: "enabled", type: "bool" },
      { name: "healthFactorThreshold", type: "uint256" },
      { name: "maxSlippage", type: "uint256" },
    ],
  },
  {
    name: "getTakeProfit",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [
      { name: "enabled", type: "bool" },
      { name: "profitTargetBps", type: "uint256" },
      { name: "maxSlippage", type: "uint256" },
    ],
  },
  {
    name: "getTrailingStop",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [
      { name: "enabled", type: "bool" },
      { name: "trailBps", type: "uint256" },
      { name: "peakCollateral", type: "uint256" },
      { name: "maxSlippage", type: "uint256" },
    ],
  },
  {
    name: "getGuardConfig",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "stopLossEnabled", type: "bool" },
          { name: "stopLossHF", type: "uint256" },
          { name: "takeProfitEnabled", type: "bool" },
          { name: "takeProfitBps", type: "uint256" },
          { name: "trailingStopEnabled", type: "bool" },
          { name: "trailingStopBps", type: "uint256" },
          { name: "peakCollateral", type: "uint256" },
        ],
      },
    ],
  },
] as const;
