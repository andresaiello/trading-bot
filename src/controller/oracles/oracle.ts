// @ts-ignore
import Web3 from "web3";
import { Oracle } from "../../model/oracle";
import { SampleOracle } from "./sampleOracle";

export const getDefaultOracle = (web3: Web3): Oracle => {
  return new SampleOracle(web3);
};
