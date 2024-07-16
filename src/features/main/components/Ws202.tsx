import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";
import { useAsset } from "../api/assetsQuery";
import {
  useLiveDataForWs202,
  useWs202HistoryQuery,
  Ws202Asset,
} from "../api/ws202_history";

export function Ws202({
  assetId,
  timeRange,
}: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  const asset = useAsset<Ws202Asset>(assetId);
  const historyQuery = useWs202HistoryQuery({
    assetId: assetId,
    timeRange,
  });
  useLiveDataForWs202({
    assetId: assetId,
    timeRange,
  });

  return (
    <div>
      <h1>Ws202 Component: {assetId}</h1>
    </div>
  );
}
