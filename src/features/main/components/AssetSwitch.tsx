import { memo } from "react";
import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";
import { Em300Th } from "./Em300Th";
import { Ws202 } from "./Ws202";

export const AssetSwitch = memo(
  ({
    assetId,
    assetType,
    timeRange,
  }: {
    assetId: string;
    assetType: string;
    timeRange: RelativeOrAbsoluteRange;
  }) => {
    switch (assetType) {
      case "EM300-TH":
        return <Em300Th assetId={assetId} timeRange={timeRange} />;
      case "WS202":
        return <Ws202 assetId={assetId} timeRange={timeRange} />;
      case "WS101":
      case "WS303":
      case "AM103L":
      case "WS301":
      default:
        return (
          <div>
            <h1>{assetId}</h1>
          </div>
        );
    }
  }
);
