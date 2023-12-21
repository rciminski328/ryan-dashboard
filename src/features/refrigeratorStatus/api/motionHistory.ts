import { QueryFunctionContext, useQuery } from "react-query";
import { getPlatformInfo } from "../../../utils/getPlatformInfo";
import { getAuthInfo } from "../../../utils/authInfo";
import { RelativeOrAbsoluteRange } from "../utils/types";
import { getTimeRangeParametersForPlot } from "../utils";
import { average } from "simple-statistics";

interface PlotMotionResponse {
  results: {
    lineData: {
      motion?: {
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
            attributes: ["motion"],
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

  return data.results.lineData.motion;
}

export function useMotionHistoryQuery(params: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  return useQuery(motionHistoryQueryKeys.byAsset(params), {
    queryFn: fetchMotionHistory,
    select: (data) => ({
      data: {
        x: data ? data.x.map((d) => new Date(d)) : [],
        y: data ? data.y : [],
      },
      stats: getMotionStats(data ? data : { x: [], y: [] }),
    }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

function getMotionStats(data: { x: string[]; y: number[] }): {
  count: number;
  averageDurationMs: number;
} {
  try {
    const durations: number[] = [];
    let count = 0;
    const noMotionDetected = 0;
    let previousMotionDetectedIndex: number | null = null;

    for (let i = 0; i < data.x.length; i++) {
      if (data.y[i] !== noMotionDetected) {
        previousMotionDetectedIndex = i;
        count++;
      } else if (
        data.y[i] === noMotionDetected &&
        previousMotionDetectedIndex !== null
      ) {
        const noMotionDetectedDate = new Date(data.x[i]);
        const motionDetectedDate = new Date(
          data.x[previousMotionDetectedIndex]
        );
        durations.push(
          noMotionDetectedDate.getTime() - motionDetectedDate.getTime()
        );
      }
    }

    return {
      count,
      averageDurationMs: average(durations),
    };
  } catch (e) {
    console.warn("Failed to get motion stats", e);
    return {
      count: 0,
      averageDurationMs: 0,
    };
  }
}
