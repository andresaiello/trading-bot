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
import { Wallet } from "./model/wallet";
import { CryptoWallet } from "./model/cryptoWallet";
import { TestWallet } from "./model/testWallet";
import { getConfig } from "./config";
import { BotService } from "./service/botService";
import { testTools } from "./controller/oracles/tools";

// initialize configuration
dotenv.config();

// SERVER CONFIG
const PORT = process.env.PORT || 5000;
const app = express();
const server = http
  .createServer(app)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// WEB3 CONFIG
const useRealWallet = process.env.REAL_WALLET === "true";
const web3 = new Web3(
  new HDWalletProvider(process.env.PRIVATE_KEY, process.env.RPC_URL)
);

const wallet: Wallet = useRealWallet
  ? new CryptoWallet(web3)
  : new TestWallet(web3);
wallet.add(new Token("ETH"));

const tokens = getConfig().TOKENS.map(e => {
  return new Token(e[0], e[1], web3);
});

tokens.map(e => {
  e.init();
  wallet.add(e);
});

const uniswap = new Uniswap(web3);
uniswap.init();

let intervalHandler: any;
let waitingProcess = false;

BotService.shouldUseRealWallet(useRealWallet);
BotService.get().init(web3, wallet, uniswap);

// Check markets every n seconds
const POLLING_INTERVAL = parseInt(process.env.POLLING_INTERVAL, 10) || 1000; // 1 Second
intervalHandler = setInterval(async () => {
  if (waitingProcess) {
    return;
  }
  waitingProcess = true;
  try {
    for (const elem of tokens) {
      await BotService.get().monitorPrice(elem);
    }
  } catch (e) {
    clearInterval(intervalHandler);
    console.error(e);
  }
  waitingProcess = false;
}, POLLING_INTERVAL);

// clearInterval(intervalHandler);
testTools();
