import { Asset } from "@clearblade/ia-mfe-core";
import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";
import {
  useEm300ThHistoryQuery,
  useLiveDataForEm300Th,
} from "../api/em300_th_history";

/**
 *
 * The asset prop represents the current state of the Em300Th asset
 */
export function Em300Th({
  asset,
  timeRange,
}: {
  asset: Asset["frontend"];
  timeRange: RelativeOrAbsoluteRange;
}) {
  // subscribe to the asset's live data
  const historyQuery = useEm300ThHistoryQuery({
    assetId: asset.id,
    timeRange,
  });
  useLiveDataForEm300Th({
    assetId: asset.id,
    timeRange,
  });
  console.log({ em300ThHistory: historyQuery, em300ThCurrentState: asset });
  return (
    <div>
      <h1>Em300Th Component: {asset.label}</h1>
    </div>
  );
}
