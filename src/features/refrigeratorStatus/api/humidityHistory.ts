import { QueryFunctionContext, useQuery } from "react-query";
import { getPlatformInfo } from "../../../utils/getPlatformInfo";
import { getAuthInfo } from "../../../utils/authInfo";
import { getStats } from "../../../utils/getStats";
import { RelativeOrAbsoluteRange } from "../utils/types";
import { getTimeRangeParametersForPlot } from "../utils";

interface PlotHumidityResponse {
  results: {
    lineData: {
      humidity?: {
        x: string[];
        y: number[];
      };
    };
  };
}

export const humidityHistoryQueryKeys = {
  byAsset: (params: { assetId: string; timeRange: RelativeOrAbsoluteRange }) =>
    [{ scope: "humidityHistory", params }] as const,
};

async function fetchHumidityHistory({
  queryKey: [
    {
      params: { assetId, timeRange },
    },
  ],
}: QueryFunctionContext<
  ReturnType<typeof humidityHistoryQueryKeys.byAsset>
>): Promise<
  NonNullable<PlotHumidityResponse["results"]["lineData"]["humidity"]>
> {
  const authInfo = getAuthInfo();
  const resp = await fetch(
    `${getPlatformInfo().url}/api/v/1/code/${
      authInfo.systemKey
    }/fetchTableItems`,
    {
      method: "POST",
      headers: {
        "ClearBlade-UserToken": authInfo.userToken,
      },
      body: JSON.stringify({
        name: "plotsV2.read",
        body: {
          defaultPlotParams: {
            ...getTimeRangeParametersForPlot(timeRange),
            attributes: ["humidity"],
            entityId: assetId,
            entityType: "asset",
          },
          pluginName: "default",
        },
      }),
    }
  );

  if (!resp.ok) {
    const errText = await resp.text();
    throw errText;
  }

  const data: PlotHumidityResponse = await resp.json();

  return data.results.lineData.humidity ?? { x: [], y: [] };
}

export function useHumidityHistoryQuery(params: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  return useQuery(humidityHistoryQueryKeys.byAsset(params), {
    queryFn: fetchHumidityHistory,
    select: (data) => ({
      data: { ...data, x: data ? data.x.map((d) => new Date(d)) : [] },
      stats: getStats(data ? data.y : []),
    }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
