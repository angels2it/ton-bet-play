import {
  Contract,
  ContractProvider,
  Sender,
  Address,
  beginCell,
  TupleBuilder,
  toNano,
  fromNano,
} from "@ton/core";
import { CONTRACT_MAINNET, CONTRACT_TESTNET } from "../helpers/constants";
import { CHAIN } from "@tonconnect/ui-react";

export default class Bet implements Contract {
  static create(chain: CHAIN): Bet {
    const address = Address.parse(
      chain == CHAIN.MAINNET ? CONTRACT_MAINNET : CONTRACT_TESTNET
    );
    return new Bet(address);
  }

  async getVotes(provider: ContractProvider) {
    const { stack } = await provider.get("get_votes", []);
    return stack.readBigNumber();
  }
  async getMyVote(provider: ContractProvider, address: Address) {
    const builder = new TupleBuilder();
    builder.writeAddress(address);
    const { stack } = await provider.get("my_vote", builder.build());
    const result_p = stack.readTupleOpt();
    if (result_p == null) {
      return null;
    }
    return {
      value: result_p.readBoolean(),
      amount: fromNano(result_p.readBigNumber()),
      odd: result_p.readNumber()
    };
  }

  async getBetBalance(provider: ContractProvider, address: Address) {
    const builder = new TupleBuilder();
    builder.writeAddress(address);
    const { stack } = await provider.get("my_balance", builder.build());
    const result_p = stack.readBigNumberOpt();
    if (result_p == null) {
      return 0;
    }
    return fromNano(result_p);
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

  async sendVote(
    provider: ContractProvider,
    via: Sender,
    timestamp: bigint,
    price: string,
    value: boolean
  ) {
    const messageBody = beginCell()
      .store((builder) => {
        builder.storeUint(2025010100, 32);
        builder.storeUint(timestamp, 257);
        builder.storeBit(value);
      })
      .endCell();
    await provider.internal(via, {
      value: toNano(price),
      body: messageBody,
    });
  }

  async sendClaim(provider: ContractProvider, via: Sender, price: string) {
    const messageBody = beginCell()
      .store((builder) => {
        builder.storeUint(2025010101, 32);
        builder.storeCoins(toNano(price));
      })
      .endCell();
    await provider.internal(via, {
      value: toNano("0.01"),
      body: messageBody,
    });
  }

  async sendResult(provider: ContractProvider, via: Sender, value: boolean) {
    const messageBody = beginCell()
      .store((builder) => {
        builder.storeUint(2025010102, 32);
        builder.storeInt(0, 257);
        builder.storeBit(value);
      })
      .endCell();
    await provider.internal(via, {
      value: toNano("0.1"),
      body: messageBody,
    });
  }

  constructor(readonly address: Address) {}
}
