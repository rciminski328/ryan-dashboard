import { QueryFunctionContext, useQuery } from "react-query";
import { getPlatformInfo } from "../../../utils/getPlatformInfo";
import { getAuthInfo } from "../../../utils/authInfo";
import { getStats } from "../../../utils/getStats";

interface PlotTemperatureResponse {
  results: {
    historyEndDate: string;
    historyStartDate: string;
    lineData: {
      temperature: {
        x: string[];
        y: number[];
      };
    };
    numberOfUpdates: 15;
  };
}

const temperatureHistoryQueryKeys = {
  byAsset: (params: { assetId: string }) =>
    [{ scope: "temperatureHistory", params }] as const,
};

async function fetchTemperatureHistory({
  queryKey: [
    {
      params: { assetId },
    },
  ],
}: QueryFunctionContext<
  ReturnType<typeof temperatureHistoryQueryKeys.byAsset>
>) {
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
            attributes: ["temperature"],
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

  const data: PlotTemperatureResponse = await resp.json();

  return {
    data: data.results.lineData.temperature,
    stats: getStats(data.results.lineData.temperature.y),
  };
}

export function useTemperatureHistoryQuery(params: { assetId: string }) {
  return useQuery(temperatureHistoryQueryKeys.byAsset(params), {
    queryFn: fetchTemperatureHistory,
  });
}
