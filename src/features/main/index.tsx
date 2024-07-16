import { useState } from "react";
import {
  RelativeOrAbsoluteRange,
  TimeUnitMultiplier,
} from "../refrigeratorStatus/utils/types";
import { useAssetsQuery } from "./api/assetsQuery";
import { AssetSwitch } from "./components/AssetSwitch";

export function Main() {
  const assetsQuery = useAssetsQuery();
  const [timeRange, setTimeRange] = useState<RelativeOrAbsoluteRange>({
    type: "relative",
    count: 1,
    units: TimeUnitMultiplier.HOURS,
  });

  if (assetsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (assetsQuery.isError) {
    return <div>Error</div>;
  }

  if (!assetsQuery.isSuccess) {
    return null;
  }

  return (
    <div>
      {assetsQuery.data.map((asset) => (
        <AssetSwitch key={asset.id} asset={asset} timeRange={timeRange} />
      ))}
    </div>
  );
}
