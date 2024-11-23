import { TonConnectButton } from "@tonconnect/ui-react";
import { useCounterContract } from "../hooks/useCounterContract";
import { useTonConnect } from "../hooks/useTonConnect";

import {
  Card,
  FlexBoxCol,
  FlexBoxRow,
  Ellipsis,
  Button,
  Input,
} from "./styled/styled";
import { useBetContract } from "../hooks/useBetContract";
import { useState } from "react";

export function BetInfo() {
  const { connected } = useTonConnect();
  const { value, address, play } = useBetContract();

  return (
    <div className="Container">
      <TonConnectButton />

      <Card>
        <FlexBoxCol>
          <h3>TON BET - BTC Price</h3>
          <FlexBoxRow>
            <b>Address</b>
            <Ellipsis>{address}</Ellipsis>
          </FlexBoxRow>
          <FlexBoxRow>
            <b>Total players</b>
            <div>{value ?? "Loading..."}</div>
          </FlexBoxRow>
        </FlexBoxCol>
      </Card>
    </div>
  );
}
