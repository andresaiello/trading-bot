// @ts-ignore
import Web3 from "web3";
import { Oracle, Recomendatiton, Action } from "../../model/oracle";
import { Wallet } from "../../model/wallet";
import { Token } from "../token";
import { Balance, isEmptyBalance } from "../../model/balance";
import { PriceCollection } from "../../model/price";

export class SampleOracle implements Oracle {
  // This oracle if have balance sell and if not buy if price is less than X
  private web3: Web3;
  // private ETH_SELL_PRICE: any;

  constructor(web3: Web3) {
    this.web3 = web3;
    // @ts-ignore
    // this.ETH_SELL_PRICE = web3.utils.toWei("400", "Ether"); // 400 Dai a.k.a. $400 USD
  }

  getRecomendation = async (
    wallet: Wallet,
    token: Token,
    priceCollection: PriceCollection,
    priceCollectionHistory: PriceCollection[],
    actions: Recomendatiton[]
  ): Promise<Recomendatiton> => {
    if (process.env.ENV === "prod") {
      return {
        action: Action.DO_NOTHING,
        token
      };
    }

    const balance = wallet.getBalance(token);

    if (!isEmptyBalance(balance)) {
      return {
        action: Action.SELL,
        token,
        ethAmount: new Balance("0"),
        tokenAmount: balance
      };
    }

    return {
      action: Action.BUY,
      token,
      ethAmount: new Balance("0.25"),
      tokenAmount: new Balance("0")
    };

    // if (price.price <= this.ETH_SELL_PRICE) {
    //   // console.log(`Token Price: ${price.amount} ${price.price} ${asset.code}`);

    //   return { action: Action.BUY, price };
    // } else {
    //   return { action: Action.DO_NOTHING };
    // }
  };
}
