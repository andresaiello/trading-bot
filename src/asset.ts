// @ts-ignore
import Web3 from "web3";
import { TOKEN_ABI } from "./abi";

export interface Balance {
  balance: string;
  weiBalance: string;
}

export class Asset {
  code: string;
  address: string;
  private web3: Web3;
  private contract: any;

  constructor(code: string, address: string, web3: Web3) {
    this.code = code;
    this.address = address;
    this.web3 = web3;
  }

  init() {
    // @ts-ignore
    this.contract = new this.web3.eth.Contract(TOKEN_ABI, this.address);
  }

  getContract = () => {
    return this.contract;
  };

  getBalance = async (code: string): Promise<Balance> => {
    try {
      let weiBalance;
      if (code === "ETH") {
        weiBalance = await this.web3.eth.getBalance(process.env.ACCOUNT);
      } else {
        weiBalance = await this.getContract()
          .methods.balanceOf(process.env.ACCOUNT)
          .call();
      }
      // @ts-ignore
      const balance = this.web3.utils.fromWei(weiBalance, "Ether");
      return { weiBalance, balance };
    } catch (_) {
      return { weiBalance: "0", balance: "0" };
    }
  };

  // todo: maybe move to wallet?
  showBalances = async () => {
    const ethBalance = await this.getBalance("ETH");
    console.log("Ether Balance:", ethBalance.balance);
    console.log("Ether WBalance:", ethBalance.weiBalance);

    const assetBalance = await this.getBalance(this.code);
    console.log("DAI Balance:", assetBalance.balance);
    console.log("DAI WBalance:", assetBalance.weiBalance);
  };
}
