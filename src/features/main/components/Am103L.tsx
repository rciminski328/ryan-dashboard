import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";
import {
  Am103LAsset,
  useAm103LHistoryQuery,
  useLiveDataForAm103L,
} from "../api/am103l_history";
import { useAsset } from "../api/assetsQuery";

export function Am103L({
  assetId,
  timeRange,
}: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  // subscribe to the asset's current state
  const asset = useAsset<Am103LAsset>(assetId);
  // subscribe to the asset's live historical data
  const historyQuery = useAm103LHistoryQuery({
    assetId: assetId,
    timeRange,
  });
  useLiveDataForAm103L({
    assetId: assetId,
    timeRange,
  });

  return (
    <div>
      <h1>Am103L Component: {assetId}</h1>
    </div>
  );
}
