// @ts-ignore
import Web3 from "web3";
import { TOKEN_ABI } from "./abi";

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

  // todo: maybe move to wallet?
  checkBalances = async () => {
    let balance;

    // Check Ether balance swap
    balance = await this.web3.eth.getBalance(process.env.ACCOUNT);
    // @ts-ignore
    balance = this.web3.utils.fromWei(balance, "Ether");
    console.log("Ether Balance:", balance);

    // Check Dai balance swap
    balance = await this.getContract()
      .methods.balanceOf(process.env.ACCOUNT)
      .call();
    // @ts-ignore
    balance = this.web3.utils.fromWei(balance, "Ether");
    console.log("Dai Balance:", balance);
  };
}
