import Big from "big.js";

export class Balance extends Big {
  constructor(b: Big | string) {
    super(b);
  }

  toWei = () => {
    return this.toFixed(6);
  };

  toNormal = () => {
    return this.toFixed(6);
  };
}

export const getEmptyBalance = () => {
  return new Balance("0");
};

export const isEmptyBalance = (b: Balance) => {
  return b === undefined || b.eq(new Balance("0"));
};
