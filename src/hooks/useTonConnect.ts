import { CHAIN } from "@tonconnect/protocol";
import { Sender, SenderArguments } from "@ton/core";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useEffect } from "react";

export function useTonConnect(): {
  sender: Sender;
  connected: boolean;
  wallet: string | null;
  network: CHAIN | null;
  loading: () => void;
} {
  const [tonConnectUI] = useTonConnectUI();

  const wallet = useTonWallet();
  useEffect(
    () =>
      tonConnectUI.onStatusChange((wallet) => {
        if (wallet == null) {
          return;
        }
        if (
          wallet.connectItems?.tonProof &&
          "proof" in wallet.connectItems.tonProof
        ) {
          console.log("propf", wallet.connectItems.tonProof);
        }
      }),
    []
  );

  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    loading: () => {
      tonConnectUI.setConnectRequestParameters({ state: "loading" });
    },
    connected: !!wallet?.account.address,
    wallet: wallet?.account.address ?? null,
    network: wallet?.account.chain ?? null,
  };
}
