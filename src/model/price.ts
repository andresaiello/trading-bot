import Big from "big.js";

export interface PriceCollection {
  ethToToken: Big;
  tokenToEth: Big;
  tokenUsd: Big;
  tokenCode: string;
  date: Date;
}
