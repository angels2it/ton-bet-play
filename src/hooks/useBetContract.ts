import { useState } from "react";
import _ from "lodash";
import Bet from "../contracts/bet";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import {
  Address,
  beginCell,
  Cell,
  fromNano,
  OpenedContract,
  toNano,
} from "ton-core";
import { useQuery } from "@tanstack/react-query";
import { CHAIN } from "@tonconnect/protocol";

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
  const { sender, wallet } = useTonConnect();

  const betContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = Bet.create();
    return client.open(contract) as OpenedContract<Bet>;
  }, [client]);

  const { data, isFetching } = useQuery(
    ["myVote"],
    async () => {
      console.log(wallet);
      if (!betContract || !wallet) return null;
      return await betContract!.getMyVote(Address.parseRaw(wallet));
    },
    { refetchInterval: 5000 }
  );

  return {
    myVote: isFetching ? null : data,
    address: betContract?.address.toString(),
    play: (price: string, value: string) => {
      sender.send({
        to: betContract!.address,
        value: toNano(value),
        body: beginCell().storeUint(0, 32).storeStringTail(price).endCell(),
      });
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
