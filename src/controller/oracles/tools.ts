import _ from "lodash";
import Big from "big.js";
import { Action, Recomendatiton, Severity } from "../../model/oracle";
import { Token } from "../token";
import { PriceCollection } from "../../model/price";
import { Balance } from "../../model/balance";

export const getMaxPrice = (
  priceCollectionHistory: PriceCollection[],
  date: Date
) => {
  const filteredList = priceCollectionHistory.filter(e => e.date > date);
  const maxPrice = _.maxBy(filteredList, e => e.tokenUsd);
  return maxPrice;
};

export const getLastAction = (token: Token, actions: Recomendatiton[]) => {
  const filteredList = actions.filter(e => e.token.code === token.code);
  const sorted = _.sortBy(filteredList, e => e.date);
  return sorted.length > 0 ? _.last(sorted) : undefined;
};

export const sortBySeverityHightFirst = (actions: Recomendatiton[]) => {
  return _.sortBy(actions, e => e.severity);
};

const date1 = new Date("2020/10/20 01:01");
const date2 = new Date("2020/10/20 02:01");
const date3 = new Date("2020/10/20 03:01");
const date4 = new Date("2020/10/20 04:01");
const date5 = new Date("2020/10/20 05:01");
const date6 = new Date("2020/10/20 06:01");
const date7 = new Date("2020/10/20 07:01");
const date8 = new Date("2020/10/20 08:01");
const date9 = new Date("2020/10/20 09:01");

// todo: add jest
export const testTools = () => {
  const ret = getMaxPrice(
    [
      {
        ethToToken: new Big("0"),
        tokenToEth: new Big("0"),
        tokenUsd: new Big("10"),
        tokenCode: "EXO",
        date: date1
      },
      {
        ethToToken: new Big("0"),
        tokenToEth: new Big("0"),
        tokenUsd: new Big("10"),
        tokenCode: "EXO",
        date: date2
      },
      {
        ethToToken: new Big("0"),
        tokenToEth: new Big("0"),
        tokenUsd: new Big("10"),
        tokenCode: "EXO",
        date: date3
      },
      {
        ethToToken: new Big("0"),
        tokenToEth: new Big("0"),
        tokenUsd: new Big("3"),
        tokenCode: "EXO",
        date: date4
      },
      {
        ethToToken: new Big("0"),
        tokenToEth: new Big("0"),
        tokenUsd: new Big("4"),
        tokenCode: "EXO",
        date: date5
      },
      {
        ethToToken: new Big("0"),
        tokenToEth: new Big("0"),
        tokenUsd: new Big("2"),
        tokenCode: "EXO",
        date: date6
      }
    ],
    date3
  );
  if (ret.tokenUsd.toFixed(6) !== "4.000000") {
    console.log("Error");
  } else {
    console.log("Ok");
  }

  const ret2 = getLastAction(new Token("EXO"), [
    {
      token: new Token("EXO"),
      action: Action.BUY,
      date: date1,
      tokenAmount: new Balance("1")
    },
    {
      token: new Token("EXO"),
      action: Action.BUY,
      date: date6,
      tokenAmount: new Balance("2")
    },
    {
      token: new Token("EXO"),
      action: Action.BUY,
      date: date2,
      tokenAmount: new Balance("3")
    },
    {
      token: new Token("EXO"),
      action: Action.BUY,
      date: date3,
      tokenAmount: new Balance("4")
    },
    {
      token: new Token("EXO"),
      action: Action.BUY,
      date: date5,
      tokenAmount: new Balance("5")
    },
    {
      token: new Token("EXO1"),
      action: Action.BUY,
      date: date6,
      tokenAmount: new Balance("6")
    }
  ]);

  if (!ret2.tokenAmount.eq(new Balance("2"))) {
    console.log("Error");
    console.log(ret2);
  } else {
    console.log("Ok");
  }

  const ret3 = sortBySeverityHightFirst([
    {
      token: new Token("EXO"),
      action: Action.BUY,
      date: date1,
      tokenAmount: new Balance("1"),
      severity: Severity.MIDLE
    },
    {
      token: new Token("EXO"),
      action: Action.BUY,
      date: date6,
      tokenAmount: new Balance("2"),
      severity: Severity.LOW
    },
    {
      token: new Token("EXO"),
      action: Action.BUY,
      date: date2,
      tokenAmount: new Balance("3"),
      severity: Severity.HIGHT
    },
    {
      token: new Token("EXO"),
      action: Action.BUY,
      date: date3,
      tokenAmount: new Balance("4"),
      severity: Severity.LOW
    },
    {
      token: new Token("EXO"),
      action: Action.BUY,
      date: date5,
      tokenAmount: new Balance("5"),
      severity: Severity.HIGHT
    },
    {
      token: new Token("EXO"),
      action: Action.BUY,
      date: date6,
      tokenAmount: new Balance("6"),
      severity: Severity.MIDLE
    }
  ]);

  if (ret3[0].severity !== Severity.HIGHT) {
    console.log("Error");
  } else {
    console.log("Ok");
  }
  if (ret3[1].severity !== Severity.HIGHT) {
    console.log("Error");
  } else {
    console.log("Ok");
  }
  if (ret3[2].severity !== Severity.MIDLE) {
    console.log("Error");
  } else {
    console.log("Ok");
  }
  if (ret3[3].severity !== Severity.MIDLE) {
    console.log("Error");
  } else {
    console.log("Ok");
  }
  if (ret3[4].severity !== Severity.LOW) {
    console.log("Error");
  } else {
    console.log("Ok");
  }
  if (ret3[5].severity !== Severity.LOW) {
    console.log("Error");
  } else {
    console.log("Ok");
  }
};
