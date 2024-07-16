import { Asset } from "@clearblade/ia-mfe-core";
import { useMessaging } from "@clearblade/ia-mfe-react";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getAuthInfo } from "../../../utils/authInfo";
import { getPlatformInfo } from "../../../utils/getPlatformInfo";
import { getTimeRangeParametersForPlot } from "../../refrigeratorStatus/utils";
import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";
import { assetsQueryKeys } from "./assetsQuery";

export type Ws303Asset = Omit<Asset["frontend"], "custom_data"> & {
  custom_data: {
    leak_detected: boolean;
  };
};

interface Ws303History {
  leak_detected: {
    x: string[];
    y: (0 | 1)[];
  };
}

const ws303HistoryQueryKeys = {
  byAsset: (params: { assetId: string; timeRange: RelativeOrAbsoluteRange }) =>
    [{ scope: "ws303History", params }] as const,
};

export function useWs303HistoryQuery({
  assetId,
  timeRange,
}: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  return useQuery({
    queryKey: ws303HistoryQueryKeys.byAsset({ assetId, timeRange }),
    queryFn: async (): Promise<Ws303History> => {
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
                attributes: ["leak_detected"],
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
          lineData: Partial<Ws303History>;
        };
      } = await resp.json();

      return {
        leak_detected: data.results.lineData.leak_detected ?? { x: [], y: [] },
      };
    },
    select: (data) => ({
      data: {
        leak_detected: data.leak_detected
          ? {
              x: data.leak_detected.x.map((timestamp) => new Date(timestamp)),
              y: data.leak_detected.y,
            }
          : { x: [], y: [] },
      },
    }),
    refetchOnWindowFocus: false,
  });
}

export function useLiveDataForWs303({
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
      const assetData = msg.payload as Ws303Asset;
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

      // update the historical leak_detected data
      if (
        typeof assetData.custom_data.leak_detected !== "undefined" &&
        !queryClient.isFetching({
          queryKey: ws303HistoryQueryKeys.byAsset({ assetId, timeRange }),
        })
      ) {
        queryClient.setQueryData<Ws303History | undefined>(
          ws303HistoryQueryKeys.byAsset({ assetId, timeRange }),
          (data) => {
            if (typeof data === "undefined") {
              return data;
            }

            return {
              ...data,
              leak_detected:
                typeof assetData.custom_data.leak_detected !== "undefined"
                  ? {
                      x: [...data.leak_detected.x, last_updated],
                      y: [
                        ...data.leak_detected.y,
                        assetData.custom_data.leak_detected === true ? 1 : 0,
                      ],
                    }
                  : data.leak_detected,
            };
          }
        );
      }
    });

    return () => unsubscribe(topics);
  }, [assetId, timeRange, subscribe, unsubscribe, queryClient]);
}
