// import Plot from 'react-plotly.js';

import { useIndoorEnvironmentStatusQuery } from "../features/indoorEnvironmentStatus/api/indoorEnvironmentStatus";
import { useRefrigeratorStatusQuery } from "../features/refrigeratorStatus/api/refrigeratorStatus";

export default function DashboardPlugin() {
  const indoorEnvironmentStatusQuery = useIndoorEnvironmentStatusQuery({
    assetId: "31913feb-50ba-46bb-90cc-f17d94bcffe4",
  });
  const refrigeratorStatusQuery = useRefrigeratorStatusQuery({
    assetId: "3d0b744b-8b83-4767-9cb3-9f394caf70b6",
  });
  return <></>;
}
