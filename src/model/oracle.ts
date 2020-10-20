import { Token } from "../controller/token";
import { Wallet } from "./wallet";
import { PriceCollection } from "./price";

export enum Action {
  DO_NOTHING,
  BUY,
  SELL
}

export interface Recomendatiton {
  action: Action;
  amount?: string;
}

export interface Oracle {
  getRecomendation: (
    wallet: Wallet,
    asset: Token,
    priceCollection: PriceCollection,
    priceCollectionHistory: PriceCollection[],
    amount: string
  ) => Promise<Recomendatiton>;
}
