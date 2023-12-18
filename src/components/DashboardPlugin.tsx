// import Plot from 'react-plotly.js';

import { useStoreStatusQuery } from "../features/storeStatus/api/storeStatus";
import { useDoorOpenHistoryQuery } from "../features/refrigeratorStatus/api/doorOpenHistory";
import { useHumidityHistoryQuery } from "../features/refrigeratorStatus/api/humidityHistory";
import { useRefrigeratorStatusQuery } from "../features/refrigeratorStatus/api/refrigeratorStatus";
import { useTemperatureHistoryQuery } from "../features/refrigeratorStatus/api/temperatureHistory";

export default function DashboardPlugin() {
  const refrigeratorAssetId = "628aef25-734f-4075-8d0d-2150ed842406";
  const storeAssetId = "f47fa820-6005-410b-88b3-652f7c8bc7eb";
  const indoorEnvironmentStatusQuery = useStoreStatusQuery({
    assetId: storeAssetId,
  });
  const refrigeratorStatusQuery = useRefrigeratorStatusQuery({
    assetId: refrigeratorAssetId,
  });
  const temperatureHistoryQuery = useTemperatureHistoryQuery({
    assetId: refrigeratorAssetId,
  });
  const humidityHistoryQuery = useHumidityHistoryQuery({
    assetId: refrigeratorAssetId,
  });
  const doorOpenHistoryQuery = useDoorOpenHistoryQuery({
    assetId: refrigeratorAssetId,
  });
  return <></>;
}
