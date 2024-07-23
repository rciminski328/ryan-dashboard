import { useState } from "react";
import {
  RelativeOrAbsoluteRange,
  TimeUnitMultiplier,
} from "../refrigeratorStatus/utils/types";
import { useAssetsQuery } from "./api/assetsQuery";
import { AssetSwitch } from "./components/AssetSwitch";
import { RelativeAbsoluteDateRangePicker } from "@clearblade/ia-mfe-react";
import { Box } from "@material-ui/core";

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
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        <Box pt={1} pb={1}>
          <RelativeAbsoluteDateRangePicker
            currentRange={timeRange}
            onApplyRange={(range) => {
              if (range) {
                setTimeRange(range);
              }
            }}
            compact
          />
        </Box>
      </Box>
      {assetsQuery.data.map((asset) => (
        <AssetSwitch
          key={asset.id}
          assetId={asset.id}
          assetType={asset.type}
          timeRange={timeRange}
        />
      ))}
    </div>
  );
}
