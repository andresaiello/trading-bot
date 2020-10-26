import Big from "big.js";
import { Token } from "../controller/token";
import { Wallet } from "./wallet";
import { PriceCollection } from "./price";
import { Balance } from "./balance";

export enum Action {
  DO_NOTHING,
  BUY,
  SELL
}

export enum Severity {
  HIGHT,
  MIDLE,
  LOW
}

export interface Recomendatiton {
  action: Action;
  token: Token;
  usdPrice?: Big;
  severity?: Severity;
  date?: Date;
  ethAmount?: Balance;
  tokenAmount?: Balance;
}

export interface Oracle {
  getRecomendation: (
    wallet: Wallet,
    asset: Token,
    priceCollection: PriceCollection,
    priceCollectionHistory: PriceCollection[],
    actions: Recomendatiton[]
  ) => Promise<Recomendatiton>;
}
