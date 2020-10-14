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
exports.Asset = void 0;
const abi_1 = require("./abi");
class Asset {
    constructor(code, address, web3) {
        this.getContract = () => {
            return this.contract;
        };
        this.getBalance = (code) => __awaiter(this, void 0, void 0, function* () {
            try {
                let weiBalance;
                if (code === "ETH") {
                    weiBalance = yield this.web3.eth.getBalance(process.env.ACCOUNT);
                }
                else {
                    weiBalance = yield this.getContract()
                        .methods.balanceOf(process.env.ACCOUNT)
                        .call();
                }
                // @ts-ignore
                const balance = this.web3.utils.fromWei(weiBalance, "Ether");
                return { weiBalance, balance };
            }
            catch (_) {
                return { weiBalance: "0", balance: "0" };
            }
        });
        // todo: maybe move to wallet?
        this.showBalances = () => __awaiter(this, void 0, void 0, function* () {
            const ethBalance = yield this.getBalance("ETH");
            console.log("Ether Balance:", ethBalance.balance);
            console.log("Ether WBalance:", ethBalance.weiBalance);
            const assetBalance = yield this.getBalance(this.code);
            console.log("DAI Balance:", assetBalance.balance);
            console.log("DAI WBalance:", assetBalance.weiBalance);
        });
        this.code = code;
        this.address = address;
        this.web3 = web3;
    }
    init() {
        // @ts-ignore
        this.contract = new this.web3.eth.Contract(abi_1.TOKEN_ABI, this.address);
    }
}
exports.Asset = Asset;
//# sourceMappingURL=asset.js.map