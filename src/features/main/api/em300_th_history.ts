import { Asset } from "@clearblade/ia-mfe-core";
import { useMessaging } from "@clearblade/ia-mfe-react";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getAuthInfo } from "../../../utils/authInfo";
import { getPlatformInfo } from "../../../utils/getPlatformInfo";
import { getStats } from "../../../utils/getStats";
import { getTimeRangeParametersForPlot } from "../../../utils/getTimeRangeParametersForPlot";
import { RelativeOrAbsoluteRange } from "../../../utils/types";
import { assetsQueryKeys } from "./assetsQuery";

export type Em300ThAsset = Omit<Asset["frontend"], "custom_data"> & {
  custom_data: {
    temperature: number;
    humidity: number;
  };
};

interface Em300ThHistory {
  temperature: {
    x: string[];
    y: number[];
  };
  humidity: {
    x: string[];
    y: number[];
  };
}

const em300ThHistoryQueryKeys = {
  byAsset: (params: { assetId: string; timeRange: RelativeOrAbsoluteRange }) =>
    [{ scope: "em300_th_history", params }] as const,
};

export function useEm300ThHistoryQuery({
  assetId,
  timeRange,
}: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  return useQuery({
    queryKey: em300ThHistoryQueryKeys.byAsset({ assetId, timeRange }),
    queryFn: async (): Promise<Em300ThHistory> => {
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
                attributes: ["temperature", "humidity"],
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
          lineData: Partial<Em300ThHistory>;
        };
      } = await resp.json();

      return {
        temperature: data.results.lineData.temperature ?? { x: [], y: [] },
        humidity: data.results.lineData.humidity ?? { x: [], y: [] },
      };
    },
    select: (data) => ({
      data: {
        temperature: data.temperature
          ? {
              x: data.temperature.x.map((timestamp) => new Date(timestamp)),
              y: data.temperature.y,
            }
          : { x: [], y: [] },
        humidity: data.humidity
          ? {
              x: data.humidity.x.map((timestamp) => new Date(timestamp)),
              y: data.humidity.y,
            }
          : { x: [], y: [] },
      },
      stats: {
        temperature: getStats(data.temperature ? data.temperature.y : []),
        humidity: getStats(data.humidity ? data.humidity.y : []),
      },
    }),
    refetchOnWindowFocus: false,
  });
}

export function useLiveDataForEm300Th({
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
      const assetData = msg.payload as Em300ThAsset;
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

      // update the historical temperature and humidity data
      if (
        (typeof assetData.custom_data.temperature !== "undefined" ||
          typeof assetData.custom_data.humidity !== "undefined") &&
        !queryClient.isFetching({
          queryKey: em300ThHistoryQueryKeys.byAsset({ assetId, timeRange }),
        })
      ) {
        queryClient.setQueryData<Em300ThHistory | undefined>(
          em300ThHistoryQueryKeys.byAsset({ assetId, timeRange }),
          (data) => {
            if (typeof data === "undefined") {
              return data;
            }

            return {
              ...data,
              temperature:
                typeof assetData.custom_data.temperature !== "undefined"
                  ? {
                      x: [...data.temperature.x, last_updated],
                      y: [
                        ...data.temperature.y,
                        assetData.custom_data.temperature,
                      ],
                    }
                  : data.temperature,
              humidity:
                typeof assetData.custom_data.humidity !== "undefined"
                  ? {
                      x: [...data.humidity.x, last_updated],
                      y: [...data.humidity.y, assetData.custom_data.humidity],
                    }
                  : data.humidity,
            };
          }
        );
      }
    });

    return () => unsubscribe(topics);
  }, [assetId, timeRange, subscribe, unsubscribe, queryClient]);
}
