import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";
import { useAsset } from "../api/assetsQuery";
import {
  Ws303Asset,
  useLiveDataForWs303,
  useWs303HistoryQuery,
} from "../api/ws303_history";

export function Ws303({
  assetId,
  timeRange,
}: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  const asset = useAsset<Ws303Asset>(assetId);
  const historyQuery = useWs303HistoryQuery({
    assetId: assetId,
    timeRange,
  });
  useLiveDataForWs303({
    assetId: assetId,
    timeRange,
  });

  return (
    <div>
      <h1>Ws303 Component: {assetId}</h1>
    </div>
  );
}
