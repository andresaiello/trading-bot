// import express from "express";
// const app = express();
// const port = 8080; // default port to listen

// // define a route handler for the default home page
// // @ts-ignore
// app.get("/", (req, res) => {
//   res.send("Hello world!");
// });

// // start the Express server
// app.listen(port, () => {
//   console.log(`server started at http://localhost:${port}`);
// });

import dotenv from "dotenv";
import express from "express";
import http from "http";
// @ts-ignore
import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { Token } from "./controller/token";
import { Uniswap } from "./controller/uniswap";
import { Action } from "./model/oracle";
import { getDefaultOracle } from "./controller/oracles/oracle";
import { Wallet, CryptoWallet } from "./model/wallet";
import { getConfig } from "./config";
import { PriceCollection } from "./model/price";

// initialize configuration
dotenv.config();

// SERVER CONFIG
const PORT = process.env.PORT || 5000;
const app = express();
const server = http
  .createServer(app)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// WEB3 CONFIG
const web3 = new Web3(
  new HDWalletProvider(process.env.PRIVATE_KEY, process.env.RPC_URL)
);

const eth = new Token("ETH");

const dai = new Token(
  "DAI",
  getConfig().DAI_CONTRACT, // Token address
  web3
);
dai.init();

const wallet: Wallet = new CryptoWallet(web3);
wallet.add(eth);
wallet.add(dai);

const uniswap = new Uniswap(web3);
uniswap.init();

const oracle = getDefaultOracle(web3);
// Minimum eth to swap
// @ts-ignore
const ETH_AMOUNT = web3.utils.toWei("0.25", "Ether");
console.log("Eth Amount", ETH_AMOUNT);

let intervalHandler: any;
let waitingProcess = false;

async function monitorPrice() {
  if (waitingProcess) {
    return;
  }

  console.log("Checking price...");
  waitingProcess = true;

  try {
    await wallet.fetchBalances();
    const token = dai;

    // const priceCollection = await uniswap.getPriceCollection(
    //   wallet,
    //   token,
    //   eth
    // );
    const priceCollection: PriceCollection = undefined;

    const recommendation = await oracle.getRecomendation(
      wallet,
      token,
      priceCollection,
      ETH_AMOUNT
    );

    if (recommendation.action !== Action.DO_NOTHING) {
      // Show balance in console
      await wallet.showBalances();
    }

    if (recommendation.action === Action.BUY) {
      console.log(`Buy ${token.code}...`);
      await uniswap.buyToken(ETH_AMOUNT, recommendation.price.amount, token);
    } else if (recommendation.action === Action.SELL) {
      console.log(`Sell ${token.code}...`);
      await uniswap.approveToken(recommendation.price.amount, token);
      await uniswap.sellToken(recommendation.price.amount, token);
    }

    if (recommendation.action !== Action.DO_NOTHING) {
      await wallet.fetchBalances();
      // Show balance in console
      await wallet.showBalances();
    }

    // Stop monitoring prices
    // clearInterval(intervalHandler);
  } catch (error) {
    console.error(error);
    waitingProcess = false;
    clearInterval(intervalHandler);
    return;
  }

  waitingProcess = false;
}

// Check markets every n seconds
const POLLING_INTERVAL = parseInt(process.env.POLLING_INTERVAL, 10) || 1000; // 1 Second
intervalHandler = setInterval(async () => {
  await monitorPrice();
}, POLLING_INTERVAL);
