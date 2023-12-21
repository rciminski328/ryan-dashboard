import { QueryFunctionContext, useQuery } from "react-query";
import { getPlatformInfo } from "../../../utils/getPlatformInfo";
import { getAuthInfo } from "../../../utils/authInfo";
import { average } from "simple-statistics";
import { sleep } from "../../../utils/sleep";
import { RelativeOrAbsoluteRange } from "../utils/types";
import { getTimeRangeParametersForPlot } from "../utils";

interface PlotDoorOpenResponse {
  results: {
    lineData: {
      doorOpen?: {
        x: string[];
        y: number[];
      };
    };
  };
}

export const doorOpenHistoryQueryKeys = {
  byAsset: (params: { assetId: string; timeRange: RelativeOrAbsoluteRange }) =>
    [{ scope: "doorOpenHistory", params }] as const,
};

async function fetchDoorOpenHistory({
  queryKey: [
    {
      params: { assetId, timeRange },
    },
  ],
}: QueryFunctionContext<ReturnType<typeof doorOpenHistoryQueryKeys.byAsset>>) {
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
            attributes: ["doorOpen"],
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

  const data: PlotDoorOpenResponse = await resp.json();

  return data.results.lineData.doorOpen ?? { x: [], y: [] };
}

function getDoorOpenStats(data: { x: string[]; y: number[] }): {
  times: number;
  averageDurationMs: number;
} {
  try {
    const durations: number[] = [];
    let times = 0;
    const doorOpen = 1;
    const doorClose = 0;
    let previousDoorOpenIndex: number | null = null;

    for (let i = 0; i < data.x.length; i++) {
      if (data.y[i] === doorOpen) {
        times++;
        previousDoorOpenIndex = i;
      } else if (data.y[i] === doorClose && previousDoorOpenIndex !== null) {
        const doorCloseDate = new Date(data.x[i]);
        const doorOpenDate = new Date(data.x[previousDoorOpenIndex]);
        durations.push(doorCloseDate.getTime() - doorOpenDate.getTime());
      }
    }

    return {
      times,
      averageDurationMs: average(durations),
    };
  } catch (e) {
    console.warn("Failed to get door open stats", e);
    return {
      times: 0,
      averageDurationMs: 0,
    };
  }
}

export function useDoorOpenHistoryQuery(params: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  return useQuery(doorOpenHistoryQueryKeys.byAsset(params), {
    queryFn: fetchDoorOpenHistory,
    select: (data) => ({
      data: { ...data, x: data ? data.x.map((d) => new Date(d)) : [] },
      stats: getDoorOpenStats(data ? data : { x: [], y: [] }),
    }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
