import { memo } from "react";
import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";
import { Am103L } from "./Am103L";
import { Em300Th } from "./Em300Th";
import { Ws101 } from "./Ws101";
import { Ws202 } from "./Ws202";
import { Ws301 } from "./Ws301";
import { Ws303 } from "./Ws303";

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
        return <Ws101 assetId={assetId} timeRange={timeRange} />;
      case "WS303":
        return <Ws303 assetId={assetId} timeRange={timeRange} />;
      case "AM103L":
        return <Am103L assetId={assetId} timeRange={timeRange} />;
      case "WS301":
        return <Ws301 assetId={assetId} timeRange={timeRange} />;
      default:
        return (
          <div>
            <h1>
              Unsupported asset type '{assetType}' for asset with id '{assetId}'
            </h1>
          </div>
        );
    }
  }
);
