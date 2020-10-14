// @ts-ignore
import Web3 from "web3";
import { EXCHANGE_ABI } from "./abi";
import { Asset } from "./asset";

export interface Price {
  price: string;
  amount: string;
}

// todo: generalize to exchange
export class Uniswap {
  private web3: Web3;
  private contract: any;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  private getContractAddress = (asset: Asset) => {
    if (asset.code === "DAI") {
      // Ropsten Uniswap Dai Exchange: https://ropsten.etherscan.io/address/0xc0fc958f7108be4060F33a699a92d3ea49b0B5f0
      return "0xc0fc958f7108be4060F33a699a92d3ea49b0B5f0";
    } else {
      return "0x0";
    }
  };

  // todo: take asset as param and add contract to a contract list
  init(asset: Asset) {
    this.contract = new this.web3.eth.Contract(
      // @ts-ignore
      EXCHANGE_ABI,
      this.getContractAddress(asset)
    );
  }

  getContract = (asset: Asset) => {
    return this.contract;
  };

  sellEth = async (ethAmount: string, tokenAmount: string, asset: Asset) => {
    const contract = this.getContract(asset);
    // Set Deadline 1 minute from now
    const moment = require("moment"); // import moment.js library
    const now = moment().unix(); // fetch current unix timestamp
    const DEADLINE = now + 60; // add 60 seconds
    console.log("Deadline", DEADLINE);

    // Transaction Settings
    const SETTINGS = {
      gasLimit: 8000000, // Override gas settings: https://github.com/ethers-io/ethers.js/issues/469
      gasPrice: this.web3.utils.toWei("50", "Gwei"),
      from: process.env.ACCOUNT, // Use your account here
      value: ethAmount // Amount of Ether to Swap
    };

    // Perform Swap
    console.log("Performing swap...");
    const result = await contract.methods
      .ethToTokenSwapInput(tokenAmount.toString(), DEADLINE)
      .send(SETTINGS);
    console.log(
      `Successful Swap: https://ropsten.etherscan.io/tx/${result.transactionHash}`
    );
  };

  getEthPrice = async (asset: Asset, ammount: any): Promise<Price> => {
    const amount = await this.getContract(asset)
      .methods.getEthToTokenInputPrice(ammount)
      .call();
    // @ts-ignore
    const price = this.web3.utils.fromWei(amount.toString(), "Ether");
    return { amount, price };
  };
}
