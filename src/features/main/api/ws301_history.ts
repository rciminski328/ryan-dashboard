import { Asset } from "@clearblade/ia-mfe-core";
import { useMessaging } from "@clearblade/ia-mfe-react";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getAuthInfo } from "../../../utils/authInfo";
import { getPlatformInfo } from "../../../utils/getPlatformInfo";
import { getTimeRangeParametersForPlot } from "../../refrigeratorStatus/utils";
import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";
import { assetsQueryKeys } from "./assetsQuery";

export type Ws301Asset = Omit<Asset["frontend"], "custom_data"> & {
  custom_data: {
    doorOpen: boolean;
  };
};

interface Ws301History {
  doorOpen: {
    x: string[];
    y: (0 | 1)[];
  };
}

const ws301HistoryQueryKeys = {
  byAsset: (params: { assetId: string; timeRange: RelativeOrAbsoluteRange }) =>
    [{ scope: "ws301History", params }] as const,
};

export function useWs301HistoryQuery({
  assetId,
  timeRange,
}: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  return useQuery({
    queryKey: ws301HistoryQueryKeys.byAsset({ assetId, timeRange }),
    queryFn: async (): Promise<Ws301History> => {
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

      const data: {
        results: {
          lineData: Partial<Ws301History>;
        };
      } = await resp.json();

      return {
        doorOpen: data.results.lineData.doorOpen ?? { x: [], y: [] },
      };
    },
    select: (data) => ({
      data: {
        doorOpen: data.doorOpen
          ? {
              x: data.doorOpen.x.map((timestamp) => new Date(timestamp)),
              y: data.doorOpen.y,
            }
          : { x: [], y: [] },
      },
    }),
    refetchOnWindowFocus: false,
  });
}

export function useLiveDataForWs301({
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
      const assetData = msg.payload as Ws301Asset;
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

      // update the historical doorOpen data
      if (
        typeof assetData.custom_data.doorOpen !== "undefined" &&
        !queryClient.isFetching({
          queryKey: ws301HistoryQueryKeys.byAsset({ assetId, timeRange }),
        })
      ) {
        queryClient.setQueryData<Ws301History | undefined>(
          ws301HistoryQueryKeys.byAsset({ assetId, timeRange }),
          (data) => {
            if (typeof data === "undefined") {
              return data;
            }

            return {
              ...data,
              doorOpen:
                typeof assetData.custom_data.doorOpen !== "undefined"
                  ? {
                      x: [...data.doorOpen.x, last_updated],
                      y: [
                        ...data.doorOpen.y,
                        assetData.custom_data.doorOpen === true ? 1 : 0,
                      ],
                    }
                  : data.doorOpen,
            };
          }
        );
      }
    });

    return () => unsubscribe(topics);
  }, [assetId, timeRange, subscribe, unsubscribe, queryClient]);
}
