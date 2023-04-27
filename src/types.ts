import BigNumber from "bignumber.js";

export interface ContractStorage {
  count: BigNumber;
  name: string;
  numberOfInteractions: BigNumber;
}