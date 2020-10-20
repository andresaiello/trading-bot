import { Price } from "@uniswap/sdk";

export interface PriceCollection {
  ethToToken: Price;
  tokenToEth: Price;
  tokenUsd: Price;
  tokenCode: string;
  date: Date;
}
