"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uniswap = void 0;
const abi_1 = require("./abi");
// todo: generalize to exchange
class Uniswap {
    constructor(web3) {
        this.getContractAddress = (asset) => {
            if (asset.code === "DAI") {
                // Ropsten Uniswap Dai Exchange: https://ropsten.etherscan.io/address/0xc0fc958f7108be4060F33a699a92d3ea49b0B5f0
                return "0xc0fc958f7108be4060F33a699a92d3ea49b0B5f0";
            }
            else {
                return "0x0";
            }
        };
        this.getContract = (asset) => {
            return this.contract;
        };
        this.sellEth = (ethAmount, tokenAmount, asset) => __awaiter(this, void 0, void 0, function* () {
            const contract = this.getContract(asset);
            // Set Deadline 1 minute from now
            const moment = require("moment"); // import moment.js library
            const now = moment().unix(); // fetch current unix timestamp
            const DEADLINE = now + 60; // add 60 seconds
            console.log("Deadline", DEADLINE);
            // Transaction Settings
            const SETTINGS = {
                gasLimit: 8000000,
                gasPrice: this.web3.utils.toWei("50", "Gwei"),
                from: process.env.ACCOUNT,
                value: ethAmount // Amount of Ether to Swap
            };
            // Perform Swap
            console.log("Performing swap...");
            const result = yield contract.methods
                .ethToTokenSwapInput(tokenAmount.toString(), DEADLINE)
                .send(SETTINGS);
            console.log(`Successful Swap: https://ropsten.etherscan.io/tx/${result.transactionHash}`);
        });
        this.getEthPrice = (asset, ammount) => __awaiter(this, void 0, void 0, function* () {
            const amount = yield this.getContract(asset)
                .methods.getEthToTokenInputPrice(ammount)
                .call();
            // @ts-ignore
            const price = this.web3.utils.fromWei(amount.toString(), "Ether");
            return { amount, price };
        });
        this.web3 = web3;
    }
    // todo: take asset as param and add contract to a contract list
    init(asset) {
        this.contract = new this.web3.eth.Contract(
        // @ts-ignore
        abi_1.EXCHANGE_ABI, this.getContractAddress(asset));
    }
}
exports.Uniswap = Uniswap;
//# sourceMappingURL=uniswap.js.map