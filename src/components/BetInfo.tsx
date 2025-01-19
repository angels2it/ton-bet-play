import { TonConnectButton } from "@tonconnect/ui-react";
import { useCounterContract } from "../hooks/useCounterContract";
import { useTonConnect } from "../hooks/useTonConnect";

import {
  Card,
  FlexBoxCol,
  FlexBoxRow,
  Ellipsis,
  Button,
} from "./styled/styled";
import { useBetContract } from "../hooks/useBetContract";
import { useEffect, useState } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

export function BetInfo() {
  const { connected, loading } = useTonConnect();
  const [resultValue, setResultValue] = useState("0");
  const { address, vote, claim, setResult, myVote, balance } = useBetContract();
  useEffect(() => {
    window.addEventListener("transaction-signed", (event) => {
      console.log("Transaction signed");
    });
    window.addEventListener("transaction-sent-for-signature", (event) => {
      console.log("transaction-sent-for-signature");
    });

  }, []);
  const handleVote = (timestamp: bigint, amount: string, value: boolean) => {
    vote(timestamp, "0.1", false).then((r) => {});
  };
  return (
    <div className="Container">
      <TonConnectButton />

      <Card>
        <FlexBoxCol>
          <h3>TON BET PLAY</h3>
          <FlexBoxRow>
            <b>Address</b>
            <Ellipsis>{address}</Ellipsis>
          </FlexBoxRow>
          <div style={{ height: "50vh" }}>
            <AdvancedRealTimeChart
              theme="light"
              autosize
              interval="15"
              width={"100%"}
              range="1D"
              style="1"
              height={"50vh"}
              hide_top_toolbar={true}
              hide_legend={true}
              hide_side_toolbar={true}
              allow_symbol_change={false}
              symbol="BTCUSDT"
              // copyrightStyles={{ parent: { display: "none" } }}
            ></AdvancedRealTimeChart>
          </div>
          <FlexBoxRow>
            <Button className="green" onClick={() => vote(0n, "0.1", true)}>
              Xanh
            </Button>
            <Button
              className="red"
              onClick={() => handleVote(0n, "0.1", false)}
            >
              Đỏ
            </Button>
          </FlexBoxRow>
          <FlexBoxRow>Balance: {balance} TON</FlexBoxRow>
          <FlexBoxRow>
            {myVote && (
              <span>
                Bạn đã đặt cược bên {myVote.value ? "Xanh" : "Đỏ"} với số tiền{" "}
                {myVote.amount} tỷ lệ cược: {myVote.odd}
              </span>
            )}
          </FlexBoxRow>
          <FlexBoxRow>
            <Button onClick={() => claim("0.02")}>Nhận thưởng</Button>
          </FlexBoxRow>

          <h1>ADMIN</h1>
          <FlexBoxRow>
            <span>Kết quả nến gần nhất?</span>
            <input
              type="radio"
              name="result"
              value="1"
              onClick={() => setResultValue("1")}
            ></input>{" "}
            Xanh
            <input
              type="radio"
              name="result"
              value="0"
              onClick={() => setResultValue("0")}
            ></input>{" "}
            Đỏ
            <Button
              onClick={() => setResult(resultValue == "1" ? true : false)}
            >
              Cài đặt kết quả
            </Button>
          </FlexBoxRow>
        </FlexBoxCol>
      </Card>
    </div>
  );
}
