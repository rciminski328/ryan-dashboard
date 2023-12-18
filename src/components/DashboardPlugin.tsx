// import Plot from 'react-plotly.js';

import { useIndoorEnvironmentStatusQuery } from "../features/indoorEnvironmentStatus/api/indoorEnvironmentStatus";
import { useRefrigeratorStatusQuery } from "../features/refrigeratorStatus/api/refrigeratorStatus";
import { useTemperatureHistoryQuery } from "../features/refrigeratorStatus/api/temperatureHistory";

export default function DashboardPlugin() {
  const refrigeratorAssetId = "3d0b744b-8b83-4767-9cb3-9f394caf70b6";
  const storeAssetId = "31913feb-50ba-46bb-90cc-f17d94bcffe4";
  const indoorEnvironmentStatusQuery = useIndoorEnvironmentStatusQuery({
    assetId: storeAssetId,
  });
  const refrigeratorStatusQuery = useRefrigeratorStatusQuery({
    assetId: refrigeratorAssetId,
  });
  const temperatureHistoryQuery = useTemperatureHistoryQuery({
    assetId: refrigeratorAssetId,
  });
  return <></>;
}
