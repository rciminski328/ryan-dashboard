import { Asset } from "@clearblade/ia-mfe-core";
import { useMessaging } from "@clearblade/ia-mfe-react";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getAuthInfo } from "../../../utils/authInfo";
import { getPlatformInfo } from "../../../utils/getPlatformInfo";
import { getTimeRangeParametersForPlot } from "../../refrigeratorStatus/utils";
import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";
import { assetsQueryKeys } from "./assetsQuery";

export type Ws202Asset = Omit<Asset["frontend"], "custom_data"> & {
  custom_data: {
    motion: boolean;
    daylight: boolean;
  };
};

interface Ws202History {
  motion: {
    x: string[];
    y: (0 | 1)[];
  };
  daylight: {
    x: string[];
    y: (0 | 1)[];
  };
}

const ws202HistoryQueryKeys = {
  byAsset: (params: { assetId: string; timeRange: RelativeOrAbsoluteRange }) =>
    [{ scope: "ws202History", params }] as const,
};

export function useWs202HistoryQuery({
  assetId,
  timeRange,
}: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  return useQuery({
    queryKey: ws202HistoryQueryKeys.byAsset({ assetId, timeRange }),
    queryFn: async (): Promise<Ws202History> => {
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
                attributes: ["motion", "daylight"],
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
          lineData: Partial<Ws202History>;
        };
      } = await resp.json();

      return {
        daylight: data.results.lineData.daylight ?? { x: [], y: [] },
        motion: data.results.lineData.motion ?? { x: [], y: [] },
      };
    },
    select: (data) => ({
      data: {
        daylight: data.daylight
          ? {
              x: data.daylight.x.map((timestamp) => new Date(timestamp)),
              y: data.daylight.y,
            }
          : { x: [], y: [] },
        motion: data.motion
          ? {
              x: data.motion.x.map((timestamp) => new Date(timestamp)),
              y: data.motion.y,
            }
          : { x: [], y: [] },
      },
    }),
    refetchOnWindowFocus: false,
  });
}

export function useLiveDataForWs202({
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
      const assetData = msg.payload as Ws202Asset;
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

      // update the historical daylight and motion data
      if (
        (typeof assetData.custom_data.daylight !== "undefined" ||
          typeof assetData.custom_data.motion !== "undefined") &&
        !queryClient.isFetching({
          queryKey: ws202HistoryQueryKeys.byAsset({ assetId, timeRange }),
        })
      ) {
        queryClient.setQueryData<Ws202History | undefined>(
          ws202HistoryQueryKeys.byAsset({ assetId, timeRange }),
          (data) => {
            if (typeof data === "undefined") {
              return data;
            }

            return {
              ...data,
              daylight:
                typeof assetData.custom_data.daylight !== "undefined"
                  ? {
                      x: [...data.daylight.x, last_updated],
                      y: [
                        ...data.daylight.y,
                        assetData.custom_data.daylight === true ? 1 : 0,
                      ],
                    }
                  : data.daylight,
              motion:
                typeof assetData.custom_data.motion !== "undefined"
                  ? {
                      x: [...data.motion.x, last_updated],
                      y: [
                        ...data.motion.y,
                        assetData.custom_data.motion === true ? 1 : 0,
                      ],
                    }
                  : data.motion,
            };
          }
        );
      }
    });

    return () => unsubscribe(topics);
  }, [assetId, timeRange, subscribe, unsubscribe, queryClient]);
}
