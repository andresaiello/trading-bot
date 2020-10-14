// @ts-ignore
import Web3 from "web3";
import { Asset } from "./asset";
import { Uniswap } from "./uniswap";

export enum Action {
  DO_NOTHING,
  TRADE,
  TRADE_BACK
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

export class RSI implements Oracle {
  private web3: Web3;
  private ETH_SELL_PRICE: any;

  constructor(web3: Web3) {
    this.web3 = web3;
    // @ts-ignore
    this.ETH_SELL_PRICE = web3.utils.toWei("400", "Ether"); // 200 Dai a.k.a. $200 USD
  }

  getRecomendation = async (
    asset: Asset,
    amount: string,
    uniswap: Uniswap
  ): Promise<Recomendatiton> => {
    // Check Eth Price
    const price = await uniswap.getEthPrice(asset, amount);
    console.log(`Eth Price: ${price} ${asset.code}`);

    if (price.price <= this.ETH_SELL_PRICE) {
      return { action: Action.TRADE, price };
    } else {
      return { action: Action.DO_NOTHING };
    }
  };
}
