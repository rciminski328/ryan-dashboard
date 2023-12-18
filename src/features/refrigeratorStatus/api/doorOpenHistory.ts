import { QueryFunctionContext, useQuery } from "react-query";
import { getPlatformInfo } from "../../../utils/getPlatformInfo";
import { getAuthInfo } from "../../../utils/authInfo";
import { average } from "simple-statistics";

interface PlotDoorOpenResponse {
  results: {
    historyEndDate: string;
    historyStartDate: string;
    lineData: {
      doorOpen: {
        x: string[];
        y: number[];
      };
    };
    numberOfUpdates: 15;
  };
}

const doorOpenHistoryQueryKeys = {
  byAsset: (params: { assetId: string }) =>
    [{ scope: "doorOpenHistory", params }] as const,
};

async function fetchDoorOpenHistory({
  queryKey: [
    {
      params: { assetId },
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
            attributes: ["doorOpen"],
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

  const data: PlotDoorOpenResponse = await resp.json();

  return {
    data: data.results.lineData.doorOpen,
    stats: getDoorOpenStats(data.results.lineData.doorOpen),
  };
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

export function useDoorOpenHistoryQuery(params: { assetId: string }) {
  return useQuery(doorOpenHistoryQueryKeys.byAsset(params), {
    queryFn: fetchDoorOpenHistory,
  });
}
