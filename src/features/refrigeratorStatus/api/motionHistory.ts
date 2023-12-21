import { QueryFunctionContext, useQuery } from "react-query";
import { getPlatformInfo } from "../../../utils/getPlatformInfo";
import { getAuthInfo } from "../../../utils/authInfo";
import { RelativeOrAbsoluteRange } from "../utils/types";
import { getTimeRangeParametersForPlot } from "../utils";
import { average } from "simple-statistics";

interface PlotMotionResponse {
  results: {
    lineData: {
      motionCount?: {
        x: string[];
        y: number[];
      };
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
            attributes: ["motion", "motionCount"],
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

  return data.results.lineData;
}

export function useMotionHistoryQuery(params: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  return useQuery(motionHistoryQueryKeys.byAsset(params), {
    queryFn: fetchMotionHistory,
    select: (data) => ({
      motion: {
        data: {
          ...data.motion,
          x: data.motion ? data.motion.x.map((d) => new Date(d)) : [],
          y: data.motion ? data.motion.y : [],
        },
        stats: getMotionStats(data.motion ? data.motion : { x: [], y: [] }),
      },
      motionCount: {
        data: {
          ...data.motionCount,
          x: data.motionCount ? data.motionCount.x.map((d) => new Date(d)) : [],
          y: data.motionCount ? data.motionCount.y : [],
        },
      },
    }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

function getMotionStats(data: { x: string[]; y: number[] }): {
  averageDurationMs: number;
} {
  try {
    const durations: number[] = [];
    const motionDetected = 132;
    const noMotionDetected = 0;
    let previousMotionDetectedIndex: number | null = null;

    for (let i = 0; i < data.x.length; i++) {
      if (data.y[i] === motionDetected) {
        previousMotionDetectedIndex = i;
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
      averageDurationMs: average(durations),
    };
  } catch (e) {
    console.warn("Failed to get motion stats", e);
    return {
      averageDurationMs: 0,
    };
  }
}
