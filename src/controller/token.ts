// @ts-ignore
import Web3 from "web3";
import { TOKEN_ABI } from "../abis/erc20Abi";

export class Token {
  code: string;
  address?: string;
  private web3: Web3;
  private contract: any;

  constructor(code: string, address?: string, web3?: Web3) {
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

  getAbi = () => {
    return TOKEN_ABI;
  };
}
