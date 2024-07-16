// @ts-nocheck
import { QueryFunctionContext, useQuery } from "react-query";
import { getTimeRangeParametersForPlot } from "../utils";
import { getAuthInfo } from "../utils/authInfo";
import { getPlatformInfo } from "../utils/getPlatformInfo";
import { getStats } from "../utils/getStats";
import { RelativeOrAbsoluteRange } from "../utils/types";

interface PlotTemperatureResponse {
  results: {
    lineData: {
      temperature?: {
        x: string[];
        y: number[];
      };
    };
  };
}

export const temperatureHistoryQueryKeys = {
  byAsset: (params: { assetId: string; timeRange: RelativeOrAbsoluteRange }) =>
    [{ scope: "temperatureHistory", params }] as const,
};

async function fetchTemperatureHistory({
  queryKey: [
    {
      params: { assetId, timeRange },
    },
  ],
}: QueryFunctionContext<
  ReturnType<typeof temperatureHistoryQueryKeys.byAsset>
>): Promise<
  NonNullable<PlotTemperatureResponse["results"]["lineData"]["temperature"]>
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
            attributes: ["temperature"],
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

  const data: PlotTemperatureResponse = await resp.json();

  return data.results.lineData.temperature ?? { x: [], y: [] };
}

export function useTemperatureHistoryQuery(params: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  return useQuery(temperatureHistoryQueryKeys.byAsset(params), {
    queryFn: fetchTemperatureHistory,
    select: (data) => ({
      data: { ...data, x: data ? data.x.map((d) => new Date(d)) : [] },
      stats: getStats(data ? data.y : []),
    }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
