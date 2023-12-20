import { QueryFunctionContext, useQuery } from "react-query";
import { getPlatformInfo } from "../../../utils/getPlatformInfo";
import { getAuthInfo } from "../../../utils/authInfo";
import { RelativeOrAbsoluteRange } from "../utils/types";
import { getTimeRangeParametersForPlot } from "../utils";

interface PlotMotionResponse {
  results: {
    historyEndDate: string;
    historyStartDate: string;
    lineData: {
      motionCount: {
        x: string[];
        y: number[];
      };
    };
  };
}

export const motionHistoryQueryKeys = {
  byAsset: (params: { assetId: string; timeRange: RelativeOrAbsoluteRange }) =>
    [{ scope: "motionHistory", params }] as const,
};

async function fetchMotionHistory({
  queryKey: [
    {
      params: { assetId, timeRange },
    },
  ],
}: QueryFunctionContext<ReturnType<typeof motionHistoryQueryKeys.byAsset>>) {
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
            attributes: ["motionCount"],
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

  const data: PlotMotionResponse = await resp.json();

  return data.results.lineData.motionCount;
}

export function useMotionHistoryQuery(params: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  return useQuery(motionHistoryQueryKeys.byAsset(params), {
    queryFn: fetchMotionHistory,
    select: (data) => ({
      data: { ...data, x: data.x.map((d) => new Date(d)) },
    }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
