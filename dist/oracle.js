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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestOracle = exports.getFavOracle = exports.Action = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
var Action;
(function (Action) {
    Action[Action["DO_NOTHING"] = 0] = "DO_NOTHING";
    Action[Action["BUY"] = 1] = "BUY";
    Action[Action["SELL"] = 2] = "SELL";
})(Action = exports.Action || (exports.Action = {}));
exports.getFavOracle = (web3) => {
    return new TestOracle(web3);
};
class TestOracle {
    constructor(web3) {
        this.getRecomendation = (asset, amount, uniswap) => __awaiter(this, void 0, void 0, function* () {
            const balance = yield asset.getBalance(asset.code);
            // Check token Price
            const tokenPrice = yield uniswap.getTokenPrice(asset, new bn_js_1.default(balance.weiBalance));
            console.log(`Token Price: ${tokenPrice.amount} ${tokenPrice.price} ${asset.code}`);
            // Check Eth Price
            const price = yield uniswap.getEthPrice(asset, amount);
            console.log(`Eth Price: ${price.amount} ${price.price} ${asset.code}`);
            // @ts-ignore
            const zero = this.web3.utils.toWei("0", "Ether");
            if (balance.weiBalance > zero) {
                return { action: Action.SELL, price: tokenPrice };
            }
            if (price.price <= this.ETH_SELL_PRICE) {
                console.log(`Token Price: ${price.amount} ${price.price} ${asset.code}`);
                return { action: Action.BUY, price };
            }
            else {
                return { action: Action.DO_NOTHING };
            }
        });
        this.web3 = web3;
        // @ts-ignore
        this.ETH_SELL_PRICE = web3.utils.toWei("400", "Ether"); // 400 Dai a.k.a. $400 USD
    }
}
exports.TestOracle = TestOracle;
//# sourceMappingURL=oracle.js.map