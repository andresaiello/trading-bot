// @ts-ignore
import Web3 from "web3";
import _ from "lodash";
import Big from "big.js";
import { Oracle, Recomendatiton, Action, Severity } from "../../model/oracle";
import { Wallet } from "../../model/wallet";
import { Token } from "../token";
import { isEmptyBalance } from "../../model/balance";
import { PriceCollection } from "../../model/price";

export class SellIfSmallDrop implements Oracle {
  // This oracle sell half of token if drops 5%
  private web3: Web3;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  private getMaxPrice = (
    priceCollectionHistory: PriceCollection[],
    date: Date
  ) => {
    const filteredList = priceCollectionHistory.filter(e => e.date > date);
    const maxPrice = _.maxBy(filteredList, e => e.tokenUsd);
    return maxPrice;
  };

  private getLastAction = (token: Token, actions: Recomendatiton[]) => {
    const filteredList = actions.filter(e => e.token.code === token.code);
    const sorted = _.sortBy(filteredList, e => e.date);
    return sorted.length > 0 ? sorted[0] : undefined;
  };

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

    if (isEmptyBalance(balance)) {
      return {
        action: Action.DO_NOTHING,
        token
      };
    }

    const lastActionDate = this.getLastAction(token, actions);
    const maxPrice = this.getMaxPrice(
      priceCollectionHistory,
      lastActionDate?.date
    );
    if (
      maxPrice.tokenUsd.times(new Big("0.95")).gte(priceCollection.tokenUsd)
    ) {
      const halfBalance = new Big(balance.balance).times(new Big("0.5"));
      const amount = this.web3.utils.toWei(halfBalance.toFixed(6));

      return {
        action: Action.SELL,
        token,
        tokenAmount: amount,
        severity: Severity.MIDLE
      };
    }
    return {
      action: Action.DO_NOTHING,
      token
    };
  };
}
