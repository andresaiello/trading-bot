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
import { Asset } from "./asset";
import { Uniswap } from "./uniswap";
import { getFavOracle, Action } from "./oracle";

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

const dai = new Asset(
  "DAI",
  "0xad6d458402f60fd3bd25163575031acdce07538d",
  web3
);
dai.init();

const uniswap = new Uniswap(web3);
uniswap.init(dai);

const oracle = getFavOracle(web3);
// Minimum eth to swap
// @ts-ignore
const ETH_AMOUNT = web3.utils.toWei("0.1", "Ether");
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
    const recommendation = await oracle.getRecomendation(
      dai,
      ETH_AMOUNT,
      uniswap
    );

    if (recommendation.action !== Action.DO_NOTHING) {
      // Show balance in console
      await dai.showBalances();
    }

    if (recommendation.action === Action.BUY) {
      console.log(`Buy ${dai.code}...`);
      // Sell Eth
      await uniswap.buyToken(ETH_AMOUNT, recommendation.price.amount, dai);
    } else if (recommendation.action === Action.SELL) {
      console.log(`Sell ${dai.code}...`);
      // Sell Eth
      await uniswap.sellToken(recommendation.price.amount, dai);
    }

    if (recommendation.action !== Action.DO_NOTHING) {
      // Show balance in console
      await dai.showBalances();
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
