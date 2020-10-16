export interface Price {
  price: string;
  amount: string;
}

export interface PriceCollection {
  ethToToken: Price;
  ethAllToToken: Price;
  tokenToEth: Price;
  tokenAllToEth: Price;
}
