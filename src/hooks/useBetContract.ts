import { useState } from "react";
import _ from "lodash";
import Bet from "../contracts/bet";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import {
  Address,
  beginCell,
  Builder,
  Cell,
  fromNano,
  OpenedContract,
  toNano,
} from "@ton/core";
import { useQuery } from "@tanstack/react-query";

export function msgToStr(msg: Cell | undefined) {
  if (!msg) {
    return [-1, null];
  }
  const body = msg.asSlice();
  if (body.remainingBits < 32) {
    return [-1, null];
  }
  const opcode = body.loadUint(32);
  if (opcode !== 0) {
    return [opcode, null];
  }
  if (body.remainingBits < 8 || body.remainingBits % 8 !== 0) {
    return [0, null];
  }
  //console.log('body.remainingBits', body.remainingBits)
  return [0, body.loadBuffer(body.remainingBits / 8).toString("utf-8")];
}

export function useBetContract() {
  const { client } = useTonClient();
  const { sender, wallet, network } = useTonConnect();

  const betContract = useAsyncInitialize(async () => {
    if (!client || !network) return;
    const contract = Bet.create(network);
    return client.open(contract) as OpenedContract<Bet>;
  }, [client]);

  const { data, isFetching } = useQuery(
    ["myVote"],
    async () => {
      if (!betContract || !wallet) return null;
      return await betContract!.getMyVote(Address.parse(wallet));
    },
    { refetchInterval: 5000 }
  );

  const { data: myBetBalance } = useQuery(
    ["myBalance"],
    async () => {
      if (!betContract || !wallet) return null;
      return await betContract!.getBetBalance(Address.parse(wallet));
    },
    { refetchInterval: 5000 }
  );

  return {
    myVote: data,
    balance: myBetBalance ?? 0,
    address: betContract?.address.toString(),
    play: (price: string, value: string) => {
      sender.send({
        to: betContract!.address,
        value: toNano(value),
        body: beginCell().storeUint(0, 32).storeStringTail(price).endCell(),
      });
    },
    vote: (timeStamp: bigint, price: string, value: boolean) => {
      return betContract!.sendVote(sender, timeStamp, price, value);
    },
    claim: (price: string) => {
      betContract?.sendClaim(sender, price);
    },
    setResult: (value: boolean) => {
      betContract?.sendResult(sender, value);
    },
    getTransactions: async () => {
      const address = betContract?.address;
      if (!address) {
        return null;
      }
      const transactions = await client?.getTransactions(betContract?.address, {
        limit: 10,
        archival: true,
      });
      return _(transactions)
        .map((tx: any) => {
          // Phân tích tin nhắn đầu vào
          if (tx.inMessage) {
            const [op, comment] = msgToStr(tx.inMessage.body);
            if (op == 0) {
              return {
                price: comment,
                coin: fromNano(tx.inMessage.info.value.coins),
                address: tx.inMessage.info.src.toString(),
                link: "https://google.com.vn",
                timestamp: tx.inMessage.info.createdAt,
              };
            }
            return null;
          } else {
            return null;
          }
        })
        .compact()
        .value();
    },
  };
}
