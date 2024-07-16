import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";
import { useAsset } from "../api/assetsQuery";
import {
  useEm300ThHistoryQuery,
  useLiveDataForEm300Th,
} from "../api/em300_th_history";

export function Em300Th({
  assetId,
  timeRange,
}: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  // subscribe to the asset's current state
  const asset = useAsset(assetId);
  // subscribe to the asset's live historical data
  const historyQuery = useEm300ThHistoryQuery({
    assetId: assetId,
    timeRange,
  });
  useLiveDataForEm300Th({
    assetId: assetId,
    timeRange,
  });
  console.log({ em300ThHistory: historyQuery, em300ThCurrentState: asset });
  return (
    <div>
      <h1>Em300Th Component: {assetId}</h1>
    </div>
  );
}
