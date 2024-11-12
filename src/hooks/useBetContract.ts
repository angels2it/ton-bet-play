import { useState } from "react";
import Bet from "../contracts/bet";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { Address, beginCell, OpenedContract, toNano } from "ton-core";
import { useQuery } from "@tanstack/react-query";
import { CHAIN } from "@tonconnect/protocol";

export function useBetContract() {
  const { client } = useTonClient();
  const { sender, network } = useTonConnect();

  const betContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = Bet.create();
    return client.open(contract) as OpenedContract<Bet>;
  }, [client]);

  const { data, isFetching } = useQuery(
    ["votes"],
    async () => {
      if (!betContract) return null;
      return (await betContract!.getVotes()).toString();
    },
    { refetchInterval: 10000 }
  );

  return {
    value: isFetching ? null : data,
    address: betContract?.address.toString(),
    play: (price: string, value: string) => {
      sender.send({
        to: betContract!.address,
        value: toNano(value),
        body: beginCell()
          .storeUint(0, 32)
          .storeStringTail(price)
          .endCell(),
      });
    },
  };
}
