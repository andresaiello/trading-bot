// @ts-ignore
import Web3 from "web3";
import { Oracle, Recomendatiton } from "../../model/oracle";
import { Wallet } from "../../model/wallet";
import { Token } from "../token";
import { Uniswap } from "../uniswap";
import { isEmptyBalance } from "../../model/balance";
import { PriceCollection } from "../../model/price";

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
    priceCollection: PriceCollection,
    amount: string
  ): Promise<Recomendatiton> => {
    //return { action: Action.DO_NOTHING };
    const balance = wallet.getBalance(asset);

    if (!isEmptyBalance(balance)) {
      return {
        action: Action.SELL,
        price: {
          amount: balance.weiBalance,
          price: priceCollection.tokenAllToEth.price
        }
      };
    }

    return { action: Action.BUY, price: priceCollection.ethToToken };
    // if (price.price <= this.ETH_SELL_PRICE) {
    //   // console.log(`Token Price: ${price.amount} ${price.price} ${asset.code}`);

    //   return { action: Action.BUY, price };
    // } else {
    //   return { action: Action.DO_NOTHING };
    // }
  };
}
