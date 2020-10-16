export interface Config {
  NETWORK: string;
  UNI_ROUTER: string;
  MAX_AMOUNT_TO_SELL: string;
  WETH: string;
  // Tokens
  DAI_CONTRACT: string;
  DAI_SWAP: string;
}

const DevConfig: Config = {
  NETWORK: "ropsten",
  UNI_ROUTER: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
  MAX_AMOUNT_TO_SELL:
    "115792089237316195423570985008687907853269984665640564039457584007913129639935",
  WETH: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  // Tokens
  DAI_CONTRACT: "0xad6d458402f60fd3bd25163575031acdce07538d",
  DAI_SWAP: "0xc0fc958f7108be4060F33a699a92d3ea49b0B5f0"
};

const ProdConfig: Config = {
  NETWORK: "mainnet",
  UNI_ROUTER: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
  MAX_AMOUNT_TO_SELL: "",
  WETH: "",
  // Tokens
  DAI_CONTRACT: "",
  DAI_SWAP: ""
};

export const getConfig = (): Config => {
  if (process.env.ENV === "prod") {
    return ProdConfig;
  } else {
    return DevConfig;
  }
};

export const getNetworkPrefix = () => {
  return getConfig().NETWORK !== "mainnet" ? `${getConfig().NETWORK}.` : "";
};
