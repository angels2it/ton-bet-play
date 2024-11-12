import { beginCell, toNano, Address, Cell, fromNano } from "ton";
import { useTonConnect } from "../hooks/useTonConnect";
import { useFaucetJettonContract } from "../hooks/useFaucetJettonContract";
import {
  Card,
  FlexBoxCol,
  FlexBoxRow,
  Button,
  Ellipsis,
} from "./styled/styled";

export function History() {
  return (
    <Card title="Jetton">
      <FlexBoxCol>
        <h3>History</h3>
        <FlexBoxRow>
          User A
          <div>65.000$</div>
        </FlexBoxRow>
        <FlexBoxRow>
          User B
          <div>75.000$</div>
        </FlexBoxRow>
      </FlexBoxCol>
    </Card>
  );
}
