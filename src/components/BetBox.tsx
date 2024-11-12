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

export function BetBox() {
  const { connected } = useTonConnect();
  const { value, address, play } = useBetContract();
  const [tonAmount, setTonAmount] = useState("0.01");
  const [price, setPrice] = useState("0");

  return (
    <div className="Container">
      <TonConnectButton />

      <Card>
        <FlexBoxCol>
          <h3>Bet now!!</h3>
          <FlexBoxRow>
            <label>BTC price? </label>
            <Input
              style={{ marginRight: 8 }}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Input>
          </FlexBoxRow>
          <FlexBoxRow>
            <label>Amount </label>
            <Input
              style={{ marginRight: 8 }}
              type="number"
              value={tonAmount}
              onChange={(e) => setTonAmount(e.target.value)}
            ></Input>
          </FlexBoxRow>
          <Button
            disabled={!connected}
            className={`Button ${connected ? "Active" : "Disabled"}`}
            onClick={() => {
              play(price, tonAmount);
            }}
          >
            Play
          </Button>
        </FlexBoxCol>
      </Card>
    </div>
  );
}
