import { Token } from "../controller/token";
import { Wallet } from "./wallet";
import { PriceCollection } from "./price";

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
  severity?: Severity;
  date?: Date;
  ethAmount?: string;
  tokenAmount?: string;
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
