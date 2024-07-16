import { Asset } from "@clearblade/ia-mfe-core";
import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";
import { Em300Th } from "./Em300Th";

export function AssetSwitch({
  asset,
  timeRange,
}: {
  asset: Asset["frontend"];
  timeRange: RelativeOrAbsoluteRange;
}) {
  switch (asset.type) {
    case "EM300-TH":
      return <Em300Th asset={asset} timeRange={timeRange} />;
    case "WS202":
    case "WS101":
    case "WS303":
    case "AM103L":
    case "WS301":
    default:
      return (
        <div>
          <h1>{asset.label}</h1>
        </div>
      );
  }
}
