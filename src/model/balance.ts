export interface Balance {
  balance: string;
  weiBalance: string;
}

export const EMPTY_BALANCE: Balance = { balance: "0", weiBalance: "0" };

export const isEmptyBalance = (b: Balance) => {
  return b.balance === "0" || b.weiBalance.replace(/o/g, "") === "";
};

// const zero = this.web3.utils.toWei("0", "Ether");
