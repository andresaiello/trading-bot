// @ts-ignore
import Web3 from "web3";
import { Token } from "../controller/token";
import { Balance, getEmptyBalance } from "./balance";
import { Recomendatiton } from "../model/oracle";
import { Wallet, TokenBalance } from "./wallet";

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
      this.tokenList = [
        ...this.tokenList,
        { token, balance: getEmptyBalance() }
      ];
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
      return new Balance(balance);
    } catch (_) {
      return getEmptyBalance();
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

  // @ts-ignore
  processAction = (_: Recomendatiton) => {
    // @ts-ignore
  }; // Real wallet process the action on blockchain
}
