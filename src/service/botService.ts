// @ts-ignore
import Web3 from "web3";
import { Oracle, Recomendatiton } from "../model/oracle";

import { Token } from "../controller/token";
import { Uniswap } from "../controller/uniswap";
import { Action } from "../model/oracle";
import { SampleOracle } from "../controller/oracles/oracle";
import { Wallet } from "../model/wallet";
import { PriceCollection } from "../model/price";

export class BotService {
  private static instance: BotService;

  //private web3: Web3;
  private oracles: Oracle[];
  private wallet: Wallet;
  private uniswap: Uniswap;
  private priceCollectionHistory: PriceCollection[] = [];
  private actions: Recomendatiton[] = [];

  constructor() {
    this.oracles = [];
  }

  static get = (): BotService => {
    if (!BotService.instance) {
      BotService.instance = new BotService();
    }
    return BotService.instance;
  };

  public init = (web3: Web3, wallet: Wallet, uniswap: Uniswap) => {
    //this.web3 = web3;
    this.wallet = wallet;
    this.uniswap = uniswap;
    this.oracles = [new SampleOracle(web3)];
  };

  private getRecommendations = async (
    token: Token,
    priceCollection: PriceCollection
  ): Promise<Recomendatiton[]> => {
    let recommendations: Recomendatiton[] = [];

    for (const oracle of this.oracles) {
      const recommendation = await oracle.getRecomendation(
        this.wallet,
        token,
        priceCollection,
        this.priceCollectionHistory,
        this.actions
      );

      recommendations = [...recommendations, recommendation];
    }
    return recommendations;
  };

  private chooseRecomendation = (
    recomendatitons: Recomendatiton[]
  ): Recomendatiton | undefined => {
    if (recomendatitons.length > 0)
      return recomendatitons.find(e => e.action !== Action.DO_NOTHING);
    else return undefined;
  };

  public monitorPrice = async (token: Token) => {
    const { wallet, uniswap } = this;
    console.log("Checking price...");

    try {
      await this.wallet.fetchBalances();

      const priceCollection = await uniswap.getPriceCollection(wallet, token);
      this.priceCollectionHistory = [
        ...this.priceCollectionHistory,
        priceCollection
      ];

      const recommendations = await this.getRecommendations(
        token,
        priceCollection
      );
      const recommendation = this.chooseRecomendation(recommendations);

      if (recommendation) {
        this.actions = [...this.actions, recommendation];
        // Show balance in console
        await wallet.showBalances();

        if (recommendation.action === Action.BUY) {
          console.log(`Buy ${token.code}...`);
          await uniswap.buyToken(recommendation.ethAmount, token);
        } else if (recommendation.action === Action.SELL) {
          console.log(`Sell ${token.code}...`);
          await uniswap.approveToken(recommendation.tokenAmount, token);
          await uniswap.sellToken(recommendation.tokenAmount, token);
        }

        await wallet.fetchBalances();
        // Show balance in console
        await wallet.showBalances();
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };
}
