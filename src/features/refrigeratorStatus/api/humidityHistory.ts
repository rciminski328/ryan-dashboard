import { QueryFunctionContext, useQuery } from "react-query";
import { getPlatformInfo } from "../../../utils/getPlatformInfo";
import { getAuthInfo } from "../../../utils/authInfo";
import { getStats } from "../../../utils/getStats";

interface PlotHumidityResponse {
  results: {
    historyEndDate: string;
    historyStartDate: string;
    lineData: {
      humidity: {
        x: string[];
        y: number[];
      };
    };
    numberOfUpdates: 15;
  };
}

export const humidityHistoryQueryKeys = {
  byAsset: (params: { assetId: string }) =>
    [{ scope: "humidityHistory", params }] as const,
};

async function fetchHumidityHistory({
  queryKey: [
    {
      params: { assetId },
    },
  ],
}: QueryFunctionContext<ReturnType<typeof humidityHistoryQueryKeys.byAsset>>) {
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
            attributes: ["humidity"],
            endDate: "",
            entityId: assetId,
            entityType: "asset",
            startDate: "",
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

  return data.results.lineData.humidity;
}

export function useHumidityHistoryQuery(params: { assetId: string }) {
  return useQuery(humidityHistoryQueryKeys.byAsset(params), {
    queryFn: fetchHumidityHistory,
    select: (data) => ({
      data: { ...data, x: data.x.map((d) => new Date(d)) },
      stats: getStats(data.y),
    }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
