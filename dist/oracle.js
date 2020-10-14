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
exports.RSI = exports.Action = void 0;
var Action;
(function (Action) {
    Action[Action["DO_NOTHING"] = 0] = "DO_NOTHING";
    Action[Action["TRADE"] = 1] = "TRADE";
    Action[Action["TRADE_BACK"] = 2] = "TRADE_BACK";
})(Action = exports.Action || (exports.Action = {}));
class RSI {
    constructor(web3) {
        this.getRecomendation = (asset, amount, uniswap) => __awaiter(this, void 0, void 0, function* () {
            // Check Eth Price
            const price = yield uniswap.getEthPrice(asset, amount);
            console.log(`Eth Price: ${price} ${asset.code}`);
            if (price.price <= this.ETH_SELL_PRICE) {
                return { action: Action.TRADE, price };
            }
            else {
                return { action: Action.DO_NOTHING };
            }
        });
        this.web3 = web3;
        // @ts-ignore
        this.ETH_SELL_PRICE = web3.utils.toWei("400", "Ether"); // 200 Dai a.k.a. $200 USD
    }
}
exports.RSI = RSI;
//# sourceMappingURL=oracle.js.map