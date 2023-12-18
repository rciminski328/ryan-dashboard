import { QueryFunctionContext, useQuery } from "react-query";
import { getPlatformInfo } from "../../../utils/getPlatformInfo";
import { getAuthInfo } from "../../../utils/authInfo";

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

  return data.results.lineData.doorOpen;
}

export function useDoorOpenHistoryQuery(params: { assetId: string }) {
  return useQuery(doorOpenHistoryQueryKeys.byAsset(params), {
    queryFn: fetchDoorOpenHistory,
  });
}
