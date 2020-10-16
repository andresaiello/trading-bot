import { Token } from "../controller/token";
import { Uniswap } from "../controller/uniswap";
import { Wallet } from "./wallet";

export enum Action {
  DO_NOTHING,
  BUY,
  SELL
}

export interface Price {
  price: string;
  amount: string;
}

export interface Recomendatiton {
  action: Action;
  price?: Price;
}

export interface Oracle {
  getRecomendation: (
    wallet: Wallet,
    asset: Token,
    amount: string,
    uniswap: Uniswap
  ) => Promise<Recomendatiton>;
}
