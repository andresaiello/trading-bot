"use strict";
// import express from "express";
// const app = express();
// const port = 8080; // default port to listen
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // define a route handler for the default home page
// // @ts-ignore
// app.get("/", (req, res) => {
//   res.send("Hello world!");
// });
// // start the Express server
// app.listen(port, () => {
//   console.log(`server started at http://localhost:${port}`);
// });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
// @ts-ignore
const web3_1 = __importDefault(require("web3"));
const hdwallet_provider_1 = __importDefault(require("@truffle/hdwallet-provider"));
const asset_1 = require("./asset");
const uniswap_1 = require("./uniswap");
const oracle_1 = require("./oracle");
// initialize configuration
dotenv_1.default.config();
// SERVER CONFIG
const PORT = process.env.PORT || 5000;
const app = express_1.default();
const server = http_1.default
    .createServer(app)
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
// WEB3 CONFIG
const web3 = new web3_1.default(new hdwallet_provider_1.default(process.env.PRIVATE_KEY, process.env.RPC_URL));
const dai = new asset_1.Asset("DAI", "0xad6d458402f60fd3bd25163575031acdce07538d", web3);
dai.init();
const uniswap = new uniswap_1.Uniswap(web3);
uniswap.init(dai);
const oracle = new oracle_1.RSI(web3);
// Minimum eth to swap
// @ts-ignore
const ETH_AMOUNT = web3.utils.toWei("0.1", "Ether");
console.log("Eth Amount", ETH_AMOUNT);
let intervalHandler;
let waitingProcess = false;
function monitorPrice() {
    return __awaiter(this, void 0, void 0, function* () {
        if (waitingProcess) {
            return;
        }
        console.log("Checking price...");
        waitingProcess = true;
        try {
            const recommendation = yield oracle.getRecomendation(dai, ETH_AMOUNT, uniswap);
            if (recommendation.action === oracle_1.Action.TRADE) {
                console.log("Selling Eth...");
                // Check balance before sale, just to show in console
                yield dai.checkBalances();
                // Sell Eth
                yield uniswap.sellEth(ETH_AMOUNT, recommendation.price.amount, dai);
                // Check balances after sale, just to show in console
                yield dai.checkBalances();
                // Stop monitoring prices
                clearInterval(intervalHandler);
            }
        }
        catch (error) {
            console.error(error);
            waitingProcess = false;
            clearInterval(intervalHandler);
            return;
        }
        waitingProcess = false;
    });
}
// Check markets every n seconds
const POLLING_INTERVAL = parseInt(process.env.POLLING_INTERVAL, 10) || 1000; // 1 Second
intervalHandler = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    yield monitorPrice();
}), POLLING_INTERVAL);
//# sourceMappingURL=index.js.map