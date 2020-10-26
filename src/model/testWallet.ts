// @ts-ignore
import Web3 from "web3";
import { Token } from "../controller/token";
import { Balance, getEmptyBalance } from "./balance";
import { Action, Recomendatiton } from "../model/oracle";
import { Wallet, TokenBalance } from "./wallet";

export class TestWallet implements Wallet {
  private tokenList: TokenBalance[];

  constructor(_: Web3) {
    this.tokenList = [];
  }

  // Add token
  add = (token: Token) => {
    const a = this.tokenList.find(e => e.token.code === token.code);
    if (!a) {
      this.tokenList = [
        ...this.tokenList,
        { token, balance: getEmptyBalance() }
      ];
    }
  };

  fetchBalances = async () => {
    // @ts-ignore
  };

  getBalance = (token: Token) => {
    try {
      const a = this.tokenList.find(e => e.token.code === token.code);
      return a ? a.balance : getEmptyBalance();
    } catch (_) {
      return getEmptyBalance();
    }
  };

  showBalances = () => {
    try {
      this.tokenList.map(a => {
        console.log(`${a.token.code} balance: ${a.balance.toNormal()}`);
      });
    } catch (e) {
      console.error(e);
    }
  };

  processAction = (action: Recomendatiton) => {
    const { token } = action;
    const tokenAmount = action.tokenAmount;
    const ethAmount = action.ethAmount;

    const currentBalance = this.tokenList.find(
      e => e.token.code === token.code
    );

    const value = currentBalance.balance;
    currentBalance.balance =
      action.action === Action.BUY
        ? new Balance(new Balance(value).add(tokenAmount))
        : new Balance(new Balance(value).minus(tokenAmount));

    const currentEthBalance = this.tokenList.find(e => e.token.code === "ETH");

    const ethValue = currentEthBalance.balance;
    currentEthBalance.balance =
      action.action === Action.SELL
        ? new Balance(new Balance(ethValue).add(ethAmount))
        : new Balance(new Balance(ethValue).minus(ethAmount));

    this.tokenList = [
      ...this.tokenList.filter(
        e => ![token.code, "ETH"].includes(e.token.code)
      ),
      currentBalance,
      currentEthBalance
    ];
  };
}
