import { getHttpEndpoint } from "@orbs-network/ton-access";
import { useState } from "react";
import { TonClient } from "@ton/ton";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { CHAIN } from "@tonconnect/protocol";

export function useTonClient() {
  const { network } = useTonConnect();

  return {
    client: useAsyncInitialize(async () => {
      if (!network) return;
      return new TonClient({
        // endpoint: await getHttpEndpoint({

        //   network: network === CHAIN.MAINNET ? "mainnet" : "testnet",
        // }),
        endpoint: network == CHAIN.TESTNET ? "https://testnet.toncenter.com/api/v2/jsonRPC" : "https://toncenter.com/api/v2/jsonRPC",
        apiKey:
          "cdadacf7c9577f86e1f330bfb89d55eae58c5194da979542deda9d1de77bc19c",
      });
    }, [network]),
  };
}
