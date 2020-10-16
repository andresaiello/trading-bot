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
  MAX_AMOUNT_TO_SELL:
    "115792089237316195423570985008687907853269984665640564039457584007913129639935",
  WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  // Tokens
  DAI_CONTRACT: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  DAI_SWAP: "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11" // NOT!!! we should update this
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
