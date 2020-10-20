import { ChainId } from "@uniswap/sdk";

export interface Config {
  NETWORK: string;
  UNI_ROUTER: string;
  MAX_AMOUNT_TO_SELL: string;
  CHAIN_ID: ChainId;
  // Tokens
  DAI_CONTRACT: string;
  TOKENS: [string, string][];
}

const DevConfig: Config = {
  NETWORK: "ropsten",
  UNI_ROUTER: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
  MAX_AMOUNT_TO_SELL:
    "115792089237316195423570985008687907853269984665640564039457584007913129639935",
  CHAIN_ID: ChainId.ROPSTEN,
  // Tokens
  DAI_CONTRACT: "0xad6d458402f60fd3bd25163575031acdce07538d",
  TOKENS: [["DAI", "0xad6d458402f60fd3bd25163575031acdce07538d"]]
};

const ProdConfig: Config = {
  NETWORK: "mainnet",
  UNI_ROUTER: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
  MAX_AMOUNT_TO_SELL:
    "115792089237316195423570985008687907853269984665640564039457584007913129639935",
  CHAIN_ID: ChainId.MAINNET,
  // Tokens
  DAI_CONTRACT: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  TOKENS: [
    ["DAI", "0x6B175474E89094C44Da98b954EedeAC495271d0F"],
    ["CORE", "0x62359Ed7505Efc61FF1D56fEF82158CcaffA23D7"]
  ]
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
