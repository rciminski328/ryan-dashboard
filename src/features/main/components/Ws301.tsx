import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";
import { useAsset } from "../api/assetsQuery";
import {
  useLiveDataForWs301,
  useWs301HistoryQuery,
  Ws301Asset,
} from "../api/ws301_history";

export function Ws301({
  assetId,
  timeRange,
}: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  const asset = useAsset<Ws301Asset>(assetId);
  const historyQuery = useWs301HistoryQuery({
    assetId: assetId,
    timeRange,
  });
  useLiveDataForWs301({
    assetId: assetId,
    timeRange,
  });

  return (
    <div>
      <h1>Ws301 Component: {assetId}</h1>
    </div>
  );
}
