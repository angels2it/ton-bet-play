import { beginCell, toNano, Address, Cell, fromNano } from "@ton/ton";
import { useTonConnect } from "../hooks/useTonConnect";
import { useFaucetJettonContract } from "../hooks/useFaucetJettonContract";
import {
  Card,
  ListItem,
  FlexBoxCol,
  FlexBoxRow,
  Button,
  Ellipsis,
} from "./styled/styled";
import { useBetContract } from "../hooks/useBetContract";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export function History() {
  const { getTransactions, address } = useBetContract();
  const { data, isFetching } = useQuery(
    ["transactions"],
    async () => {
      if (!address) return null;
      return await getTransactions();
    },
    { refetchInterval: 10000 }
  );
  console.log(data);
  return (
    <Card title="Jetton">
      <FlexBoxCol>
        <h3>History</h3>
        {data &&
          data.map((d: any, index: number) => (
            <ListItem>
              <FlexBoxRow key={index.toString()}>
                <div style={{ fontSize: 20, fontWeight: "bold" }}>
                  <div>Bet {d.coin} TON for price:</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: "bold" }}>
                  <div>{d.price}</div>
                </div>
              </FlexBoxRow>
              <FlexBoxRow>{new Date(d.timestamp * 1000).toString()}</FlexBoxRow>
              <FlexBoxRow>
                <div style={{ float: "left", color: "#c4c4c4" }}>
                  <a href={d.link}>{d.address}</a> -{" "}
                </div>
              </FlexBoxRow>
            </ListItem>
          ))}
      </FlexBoxCol>
    </Card>
  );
}
