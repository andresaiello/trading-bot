// @ts-ignore
import Web3 from "web3";
import BN from "bn.js";
import { Oracle, Recomendatiton } from "../../model/oracle";
import { Wallet } from "../../model/wallet";
import { Token } from "../token";
import { Uniswap } from "../uniswap";

export enum Action {
  DO_NOTHING,
  BUY,
  SELL
}

export class SampleOracle implements Oracle {
  // This oracle if have balance sell and if not buy if price is less than X
  private web3: Web3;
  // private ETH_SELL_PRICE: any;

  constructor(web3: Web3) {
    this.web3 = web3;
    // @ts-ignore
    this.ETH_SELL_PRICE = web3.utils.toWei("400", "Ether"); // 400 Dai a.k.a. $400 USD
  }

  getRecomendation = async (
    wallet: Wallet,
    asset: Token,
    amount: string,
    uniswap: Uniswap
  ): Promise<Recomendatiton> => {
    const balance = wallet.getBalance(asset);

    // Check Eth Price
    const price = await uniswap.getEthPrice(asset, amount);
    console.log(`Eth Price: ${price.amount} ${price.price} ${asset.code}`);

    // @ts-ignore
    const zero = this.web3.utils.toWei("0", "Ether");
    if (balance.weiBalance > zero) {
      // Check token Price
      // const tokenPrice = await uniswap.getTokenPrice(asset, new BN("1"));
      const tokenPrice = await uniswap.getTokenPrice(asset, balance.weiBalance);
      console.log(`Token Price: ${tokenPrice.amount} ${tokenPrice.price} ETH`);

      return {
        action: Action.SELL,
        price: { amount: balance.weiBalance, price: tokenPrice.price }
      };
    }

    return { action: Action.BUY, price };
    // if (price.price <= this.ETH_SELL_PRICE) {
    //   // console.log(`Token Price: ${price.amount} ${price.price} ${asset.code}`);

    //   return { action: Action.BUY, price };
    // } else {
    //   return { action: Action.DO_NOTHING };
    // }
  };
}
