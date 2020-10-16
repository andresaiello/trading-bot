// @ts-ignore
import Web3 from "web3";
import { Token } from "../controller/token";
import { Balance, EMPTY_BALANCE } from "./balance";

export interface TokenBalance {
  token: Token;
  balance: Balance;
}

export interface Wallet {
  add: (token: Token) => void;
  fetchBalances: () => Promise<void>;
  getBalance: (token: Token) => Balance;
  showBalances: () => void;
}

export class CryptoWallet implements Wallet {
  private web3: Web3;
  private tokenList: TokenBalance[];

  constructor(web3: Web3) {
    this.web3 = web3;
    this.tokenList = [];
  }

  // Add token
  add = (token: Token) => {
    const a = this.tokenList.find(e => e.token.code === token.code);
    if (!a) {
      this.tokenList = [...this.tokenList, { token, balance: EMPTY_BALANCE }];
    }
  };

  private fetchBalancePerToken = async (token: Token): Promise<Balance> => {
    try {
      let weiBalance;
      if (token.code === "ETH") {
        weiBalance = await this.web3.eth.getBalance(process.env.ACCOUNT);
      } else {
        weiBalance = await token
          .getContract()
          .methods.balanceOf(process.env.ACCOUNT)
          .call();
      }
      // @ts-ignore
      const balance = this.web3.utils.fromWei(weiBalance, "Ether");
      return { weiBalance, balance };
    } catch (_) {
      return EMPTY_BALANCE;
    }
  };

  private fetchAndUpdateToken = async (token: Token): Promise<void> => {
    const balance = await this.fetchBalancePerToken(token);
    this.tokenList = [
      ...this.tokenList.filter(e => e.token.code !== token.code),
      { token, balance }
    ];
  };

  fetchBalances = async () => {
    try {
      const p = this.tokenList.map(a => {
        return this.fetchAndUpdateToken(a.token);
      });
      await Promise.all(p);
    } catch (e) {
      console.error(e);
    }
  };

  getBalance = (token: Token) => {
    try {
      const a = this.tokenList.find(e => e.token.code === token.code);
      return a ? a.balance : EMPTY_BALANCE;
    } catch (_) {
      return EMPTY_BALANCE;
    }
  };

  showBalances = () => {
    try {
      this.tokenList.map(a => {
        console.log(`${a.token.code} balance: ${a.balance.balance}`);
      });
    } catch (e) {
      console.error(e);
    }
  };
}
