// @ts-ignore
import Web3 from "web3";
import { EXCHANGE_ABI } from "../abis/daiUniswapAbi";
import { TOKEN_ABI } from "../abis/erc20Abi";
import { Token } from "./token";
import { getConfig, getNetworkPrefix } from "../config";

export interface Price {
  price: string;
  amount: string;
}

// todo: generalize to exchange
export class Uniswap {
  private web3: Web3;
  private contract: any;
  private proxyContract: any;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  // todo: take asset as param and add contract to a contract list
  init(asset: Token) {
    this.contract = new this.web3.eth.Contract(
      // @ts-ignore
      EXCHANGE_ABI,
      asset.uniswapBuy
    );
    this.proxyContract = new this.web3.eth.Contract(
      // @ts-ignore
      TOKEN_ABI,
      getConfig().UNI_ROUTER
    );
  }

  // todo: add a list to return a contract per asset
  getContract = (asset: Token) => {
    return this.contract;
  };

  buyToken = async (ethAmount: string, tokenAmount: string, asset: Token) => {
    console.log(
      "Buy ",
      asset.code,
      " ETH: ",
      ethAmount,
      ", ",
      asset.code,
      ": ",
      tokenAmount
    );
    const contract = this.getContract(asset);
    const defaultSetting = this.getSetting();

    // Perform Swap
    console.log("Performing swap...");
    const result = await contract.methods
      .ethToTokenSwapInput(tokenAmount.toString(), this.getDeadline())
      .send({ ...defaultSetting, value: ethAmount });
    console.log(
      `Successful Swap: https://${getNetworkPrefix()}etherscan.io/tx/${
        result.transactionHash
      }`
    );
  };

  // todo: add min eth to buy
  approveToken = async (tokenAmount: string, asset: Token) => {
    const contract = asset.getContract();

    // Approving Swap
    console.log("Approving swap...");
    const result = await contract.methods
      .approve(getConfig().UNI_ROUTER, getConfig().MAX_AMOUNT_TO_SELL)
      .send(this.getSetting());

    console.log(
      `Successful approve: https://${getNetworkPrefix()}etherscan.io/tx/${
        result.transactionHash
      }`
    );
  };

  // todo: add min eth to buy
  sellToken = async (tokenAmount: string, asset: Token) => {
    console.log("Sell ", asset.code, ": ", tokenAmount);

    const contract = this.proxyContract;

    // Perform Swap
    console.log("Performing swap...");
    const result = await contract.methods
      .swapExactTokensForETH(
        tokenAmount.toString(),
        "22366615421203459", // que poner aca??? min eth que quiero recibir??
        [asset.address, getConfig().WETH], // always weth
        process.env.ACCOUNT,
        this.getDeadline()
      )
      .send(this.getSetting());

    console.log(
      `Successful Swap: https://${getNetworkPrefix()}etherscan.io/tx/${
        result.transactionHash
      }`
    );
  };

  getEthPrice = async (asset: Token, ammount: any): Promise<Price> => {
    const amount = await this.getContract(asset)
      .methods.getEthToTokenInputPrice(ammount)
      .call();
    // @ts-ignore
    const price = this.web3.utils.fromWei(amount.toString(), "Ether");
    return { amount, price };
  };

  getTokenPrice = async (asset: Token, ammount: any): Promise<Price> => {
    const amount = await this.getContract(asset)
      .methods.getTokenToEthInputPrice(ammount)
      .call();
    // @ts-ignore
    const price = this.web3.utils.fromWei(amount.toString(), "Ether");

    return { amount, price };
  };

  private getDeadline = () => {
    // Set Deadline 10 minute from now
    const moment = require("moment"); // import moment.js library
    const now = moment().unix(); // fetch current unix timestamp
    return now + 60 * 10; // add 60 seconds
  };

  private getSetting = () => {
    // Transaction Settings
    return {
      gasLimit: 8000000, // Override gas settings: https://github.com/ethers-io/ethers.js/issues/469
      gasPrice: this.web3.utils.toWei("80", "Gwei"),
      from: process.env.ACCOUNT // Use your account here
    };
  };
}
