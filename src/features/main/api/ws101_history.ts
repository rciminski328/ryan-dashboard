import { Asset } from "@clearblade/ia-mfe-core";
import { useMessaging } from "@clearblade/ia-mfe-react";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getAuthInfo } from "../../../utils/authInfo";
import { getPlatformInfo } from "../../../utils/getPlatformInfo";
import { getTimeRangeParametersForPlot } from "../../../utils/getTimeRangeParametersForPlot";
import { RelativeOrAbsoluteRange } from "../../../utils/types";
import { assetsQueryKeys } from "./assetsQuery";

export type Ws101Asset = Omit<Asset["frontend"], "custom_data"> & {
  custom_data: {
    button_pushed: boolean;
  };
};

interface Ws101History {
  button_pushed: {
    x: string[];
    y: (0 | 1)[];
  };
}

const ws101HistoryQueryKeys = {
  byAsset: (params: { assetId: string; timeRange: RelativeOrAbsoluteRange }) =>
    [{ scope: "ws101History", params }] as const,
};

export function useWs101HistoryQuery({
  assetId,
  timeRange,
}: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  return useQuery({
    queryKey: ws101HistoryQueryKeys.byAsset({ assetId, timeRange }),
    queryFn: async (): Promise<Ws101History> => {
      const authInfo = getAuthInfo();
      const resp = await fetch(
        `${getPlatformInfo().url}/api/v/1/code/${
          authInfo.systemKey
        }/fetchTableItems?id=plotsV2.read`,
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
                attributes: ["button_pushed"],
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

      const data: {
        results: {
          lineData: Partial<Ws101History>;
        };
      } = await resp.json();

      return {
        button_pushed: data.results.lineData.button_pushed ?? { x: [], y: [] },
      };
    },
    select: (data) => ({
      data: {
        button_pushed: data.button_pushed
          ? {
              x: data.button_pushed.x.map((timestamp) => new Date(timestamp)),
              y: data.button_pushed.y,
            }
          : { x: [], y: [] },
      },
    }),
    refetchOnWindowFocus: false,
  });
}

export function useLiveDataForWs101({
  assetId,
  timeRange,
}: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  const { subscribe, unsubscribe } = useMessaging();
  const queryClient = useQueryClient();
  useEffect(() => {
    const topics = [`_dbupdate/_monitor/_asset/${assetId}/locStatusHistory`];
    subscribe(topics, (msg) => {
      const assetData = msg.payload as Ws101Asset;
      const last_updated = assetData.last_updated;
      if (last_updated === null) {
        console.warn(
          `Received message from on ${msg.message.destinationName} that contained a null value for last_updated. Ignoring`
        );
        return;
      }

      // update the current state of the asset
      queryClient.setQueryData<Asset["frontend"][] | undefined>(
        assetsQueryKeys.all,
        (data) => {
          if (typeof data === "undefined") {
            return data;
          }

          return data.map((asset) => {
            if (asset.id !== assetId) {
              return asset;
            }

            return {
              ...asset,
              last_updated: last_updated,
              custom_data: {
                ...asset.custom_data,
                ...assetData.custom_data,
              },
            };
          });
        }
      );

      // update the historical button_pushed data
      if (
        typeof assetData.custom_data.button_pushed !== "undefined" &&
        !queryClient.isFetching({
          queryKey: ws101HistoryQueryKeys.byAsset({ assetId, timeRange }),
        })
      ) {
        queryClient.setQueryData<Ws101History | undefined>(
          ws101HistoryQueryKeys.byAsset({ assetId, timeRange }),
          (data) => {
            if (typeof data === "undefined") {
              return data;
            }

            return {
              ...data,
              button_pushed:
                typeof assetData.custom_data.button_pushed !== "undefined"
                  ? {
                      x: [...data.button_pushed.x, last_updated],
                      y: [
                        ...data.button_pushed.y,
                        assetData.custom_data.button_pushed === true ? 1 : 0,
                      ],
                    }
                  : data.button_pushed,
            };
          }
        );
      }
    });

    return () => unsubscribe(topics);
  }, [assetId, timeRange, subscribe, unsubscribe, queryClient]);
}
