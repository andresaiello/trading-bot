import { Token } from "../controller/token";
import { Balance } from "./balance";
import { Recomendatiton } from "../model/oracle";

export interface TokenBalance {
  token: Token;
  balance: Balance;
}

export interface Wallet {
  add: (token: Token) => void;
  fetchBalances: () => Promise<void>;
  getBalance: (token: Token) => Balance;
  showBalances: () => void;
  processAction: (action: Recomendatiton) => void;
}
