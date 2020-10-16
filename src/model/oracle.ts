import { Token } from "../controller/token";
import { Wallet } from "./wallet";
import { Price, PriceCollection } from "./price";

export enum Action {
  DO_NOTHING,
  BUY,
  SELL
}

export interface Recomendatiton {
  action: Action;
  price?: Price;
}

export interface Oracle {
  getRecomendation: (
    wallet: Wallet,
    asset: Token,
    priceCollection: PriceCollection,
    amount: string
  ) => Promise<Recomendatiton>;
}
