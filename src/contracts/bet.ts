import {
  Contract,
  ContractProvider,
  Sender,
  Address,
  beginCell,
} from "ton-core";
import { CONTRACT_MAINNET, CONTRACT_TESTNET } from "../helpers/constants";
import { CHAIN } from "@tonconnect/ui-react";

export default class Bet implements Contract {
  static create(): Bet {
    const address = Address.parse(
      CHAIN.MAINNET ? CONTRACT_MAINNET : CONTRACT_TESTNET
    );
    return new Bet(address);
  }

  async getVotes(provider: ContractProvider) {
    const { stack } = await provider.get("get_votes", []);
    return stack.readBigNumber();
  }
  async getMyVote(provider: ContractProvider, address: Address) {
    console.log(address)
    const { stack } = await provider.get("get_my_vote", [
      { type: "slice", cell: beginCell().storeAddress(address).endCell() },
    ]);
    return [stack.readBigNumber(), stack.readBigNumber(), stack.readBigNumber()];
  }

  async sendIncrement(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(1, 32) // op (op #1 = increment)
      .storeUint(0, 64) // query id
      .endCell();
    await provider.internal(via, {
      value: "0.002", // send 0.002 TON for gas
      body: messageBody,
    });
  }

  constructor(readonly address: Address) {}
}
