export const UNISWAP_V2_ABI = [
  {
    name: "swapExactTokensForETH",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "amountIn" },
      { type: "uint256", name: "amountOutMin" },
      { type: "address[]", name: "path" },
      { type: "address", name: "to" },
      { type: "uint256", name: "deadline" }
    ],
    constant: !1,
    payable: !1,
    type: "function",
    gas: 47503
  },
  {
    name: "swapExactETHForTokens",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "amountOutMin" },
      { type: "address[]", name: "path" },
      { type: "address", name: "to" },
      { type: "uint256", name: "deadline" }
    ],
    constant: !1,
    type: "function",
    gas: 47503
  }
];
