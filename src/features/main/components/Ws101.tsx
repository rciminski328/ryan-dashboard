import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";
import { useAsset } from "../api/assetsQuery";
import {
  useLiveDataForWs101,
  useWs101HistoryQuery,
  Ws101Asset,
} from "../api/ws101_history";

export function Ws101({
  assetId,
  timeRange,
}: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  const asset = useAsset<Ws101Asset>(assetId);
  const historyQuery = useWs101HistoryQuery({
    assetId: assetId,
    timeRange,
  });
  useLiveDataForWs101({
    assetId: assetId,
    timeRange,
  });

  return (
    <div>
      <h1>Ws101 Component: {assetId}</h1>
    </div>
  );
}
