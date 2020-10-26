// @ts-ignore
import Web3 from "web3";
import _ from "lodash";
import Big from "big.js";
import { Oracle, Recomendatiton, Action, Severity } from "../../model/oracle";
import { getLastAction } from "./tools";
import { Wallet } from "../../model/wallet";
import { Token } from "../token";
import { isEmptyBalance } from "../../model/balance";
import { PriceCollection } from "../../model/price";

export class SellIfDropSinceBuy implements Oracle {
  // This oracle sell all the token if drops 15%
  private web3: Web3;

  constructor(web3: Web3) {
    this.web3 = web3;
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

    if (isEmptyBalance(balance)) {
      return {
        action: Action.DO_NOTHING,
        token
      };
    }

    const lastAction = getLastAction(token, actions);
    if (
      lastAction.usdPrice.times(new Big("0.90")).gte(priceCollection.tokenUsd)
    ) {
      return {
        action: Action.SELL,
        token,
        tokenAmount: balance,
        severity: Severity.HIGHT
      };
    }
    return {
      action: Action.DO_NOTHING,
      token
    };
  };
}
