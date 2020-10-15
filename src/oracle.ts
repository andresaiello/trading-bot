// @ts-ignore
import Web3 from "web3";
import BN from "bn.js";
import { Asset } from "./asset";
import { Uniswap } from "./uniswap";

export enum Action {
  DO_NOTHING,
  BUY,
  SELL
}

export interface Price {
  price: string;
  amount: string;
}

export interface Recomendatiton {
  action: Action;
  price?: Price;
}

export interface Oracle {
  getRecomendation: (
    asset: Asset,
    amount: string,
    uniswap: Uniswap
  ) => Promise<Recomendatiton>;
}

export const getFavOracle = (web3: Web3): Oracle => {
  return new TestOracle(web3);
};

export class TestOracle implements Oracle {
  // This oracle if have balance sell and if not buy if price is less than X
  private web3: Web3;
  private ETH_SELL_PRICE: any;

  constructor(web3: Web3) {
    this.web3 = web3;
    // @ts-ignore
    this.ETH_SELL_PRICE = web3.utils.toWei("400", "Ether"); // 400 Dai a.k.a. $400 USD
  }

  getRecomendation = async (
    asset: Asset,
    amount: string,
    uniswap: Uniswap
  ): Promise<Recomendatiton> => {
    const balance = await asset.getBalance(asset.code);

    // Check token Price
    const tokenPrice = await uniswap.getTokenPrice(asset, new BN("1"));
    console.log(`Token Price: ${tokenPrice.amount} ${tokenPrice.price} ETH`);

    // Check Eth Price
    const price = await uniswap.getEthPrice(asset, amount);
    console.log(`Eth Price: ${price.amount} ${price.price} ${asset.code}`);

    // @ts-ignore
    const zero = this.web3.utils.toWei("0", "Ether");
    if (balance.weiBalance > zero) {
      return {
        action: Action.SELL,
        price: { amount: balance.weiBalance, price: tokenPrice.price }
      };
    }

    if (price.price <= this.ETH_SELL_PRICE) {
      console.log(`Token Price: ${price.amount} ${price.price} ${asset.code}`);

      return { action: Action.BUY, price };
    } else {
      return { action: Action.DO_NOTHING };
    }
  };
}
