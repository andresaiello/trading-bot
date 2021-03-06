// @ts-ignore
import Web3 from "web3";
import Big from "big.js";
import { UNISWAP_V2_ABI } from "../abis/uniswapV2Abi";
import { Token } from "./token";
import { getConfig, getNetworkPrefix } from "../config";
import { PriceCollection } from "../model/price";
import { Wallet } from "../model/wallet";
import {
  Token as TokenUni,
  WETH,
  Fetcher,
  Route,
  Price,
  Currency
} from "@uniswap/sdk";
import { Balance } from "../model/balance";

// todo: generalize to exchange
export class Uniswap {
  private web3: Web3;
  // private contract: any;
  private proxyContract: any;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  // todo: take asset as param and add contract to a contract list
  init() {
    this.proxyContract = new this.web3.eth.Contract(
      // @ts-ignore
      UNISWAP_V2_ABI,
      getConfig().UNI_ROUTER
    );
  }

  buyToken = async (
    value: Balance,
    asset: Token,
    gasPriceInput: number = 80,
    gasLimit: number = 8000000
  ) => {
    const ethAmount = this.web3.utils.toWei(value.toWei());

    console.log("Buy ", asset.code, " ETH: ", ethAmount, ", ", asset.code);
    const contract = this.proxyContract;

    const settings = {
      ...this.getSetting(gasPriceInput, gasLimit),
      value: ethAmount
    };
    // Perform Swap
    console.log("Performing swap...");
    const result = await contract.methods
      .swapExactETHForTokens(
        "22366615421203459", // que poner aca??? min eth que quiero recibir??
        [WETH[getConfig().CHAIN_ID].address, asset.address], // always weth
        process.env.ACCOUNT,
        this.getDeadline()
      )
      .send(settings);
    console.log(
      `Successful Swap: https://${getNetworkPrefix()}etherscan.io/tx/${
        result.transactionHash
      }`
    );
  };

  // todo: add min eth to buy
  approveToken = async (
    tokenAmount: Balance,
    asset: Token,
    gasPriceInput: number = 80,
    gasLimit: number = 8000000
  ) => {
    const contract = asset.getContract();

    // Approving Swap
    console.log("Approving swap...");
    const result = await contract.methods
      .approve(getConfig().UNI_ROUTER, getConfig().MAX_AMOUNT_TO_SELL)
      .send(this.getSetting(gasPriceInput, gasLimit));

    console.log(
      `Successful approve: https://${getNetworkPrefix()}etherscan.io/tx/${
        result.transactionHash
      }`
    );
  };

  // todo: add min eth to buy
  sellToken = async (
    value: Balance,
    asset: Token,
    gasPriceInput: number = 80,
    gasLimit: number = 8000000
  ) => {
    const tokenAmount = this.web3.utils.toWei(value.toWei());

    console.log("Sell ", asset.code, ": ", tokenAmount);

    const contract = this.proxyContract;

    // Perform Swap
    console.log("Performing swap...");
    const result = await contract.methods
      .swapExactTokensForETH(
        tokenAmount.toString(),
        "22366615421203459", // que poner aca??? min eth que quiero recibir??
        [asset.address, WETH[getConfig().CHAIN_ID].address], // always weth
        process.env.ACCOUNT,
        this.getDeadline()
      )
      .send(this.getSetting(gasPriceInput, gasLimit));

    console.log(
      `Successful Swap: https://${getNetworkPrefix()}etherscan.io/tx/${
        result.transactionHash
      }`
    );
  };

  getTokenPerEth = async (token: Token): Promise<Price> => {
    const someToken = new TokenUni(getConfig().CHAIN_ID, token.address, 18);

    // note that you may want/need to handle this async code differently,
    // for example if top-level await is not an option
    const pair = await Fetcher.fetchPairData(
      someToken,
      WETH[getConfig().CHAIN_ID]
    );

    const route = new Route([pair], WETH[getConfig().CHAIN_ID]);

    // console.log(route.midPrice.toSignificant(6)); // 201.306
    // console.log(route.midPrice.invert().toSignificant(6)); // 0.00496756

    return route.midPrice;
  };

  getEthPerToken = async (token: Token): Promise<Price> => {
    const someToken = new TokenUni(getConfig().CHAIN_ID, token.address, 18);
    const pair = await Fetcher.fetchPairData(
      someToken,
      WETH[getConfig().CHAIN_ID]
    );

    const route = new Route([pair], WETH[getConfig().CHAIN_ID]);
    return route.midPrice;
  };

  getTokenPrice = async (token: Token): Promise<Price> => {
    const someToken = new TokenUni(getConfig().CHAIN_ID, token.address, 18);
    const daiToken = new TokenUni(
      getConfig().CHAIN_ID,
      getConfig().DAI_CONTRACT,
      18
    );

    if (daiToken.address === someToken.address) {
      return new Price(Currency.ETHER, Currency.ETHER, "1", "1");
    }

    const someTokenEthPair = await Fetcher.fetchPairData(
      someToken,
      WETH[getConfig().CHAIN_ID]
    );
    const DAIEthPair = await Fetcher.fetchPairData(
      WETH[getConfig().CHAIN_ID],
      daiToken
    );

    const route = new Route([DAIEthPair, someTokenEthPair], daiToken);
    return route.midPrice;
  };

  private getDeadline = () => {
    // Set Deadline 10 minute from now
    const moment = require("moment"); // import moment.js library
    const now = moment().unix(); // fetch current unix timestamp
    return now + 60 * 10; // add 60 seconds
  };

  private getSetting = (
    gasPriceInput: number = 80,
    gasLimit: number = 8000000
  ) => {
    // Transaction Settings
    return {
      gasLimit, // Override gas settings: https://github.com/ethers-io/ethers.js/issues/469
      gasPrice: this.web3.utils.toWei(gasPriceInput.toString(10), "Gwei"),
      from: process.env.ACCOUNT // Use your account here
    };
  };

  // Return eth->token, token->eth, per unit and per balance
  getPriceCollection = async (
    wallet: Wallet,
    token: Token
  ): Promise<PriceCollection> => {
    const ethToTokenPrice = await this.getTokenPerEth(token);
    const ethToToken = new Big(ethToTokenPrice.toSignificant(6));
    console.log(`1 ETH -> ${ethToToken.toFixed(6)}${token.code}`);

    const tokenToEthPrice = await this.getEthPerToken(token);
    const tokenToEth = new Big(tokenToEthPrice.invert().toSignificant(6));
    console.log(`${token.code} -> ${tokenToEth.toFixed(6)} ETH`);

    const tokenUsdPrice = await this.getTokenPrice(token);
    const tokenUsd = new Big(tokenUsdPrice.invert().toSignificant(6));
    console.log(`${token.code} -> ${tokenUsd.toFixed(6)} USD`);

    return {
      ethToToken,
      tokenToEth,
      tokenUsd,
      tokenCode: token.code,
      date: new Date()
    };
  };
}
