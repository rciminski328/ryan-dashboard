import {
  Asset,
  createFrontendAssetsQuery,
  fetchAssets,
} from "@clearblade/ia-mfe-core";
import { useMessaging } from "@clearblade/ia-mfe-react";
import { useEffect } from "react";
import { QueryFunctionContext, useQuery, useQueryClient } from "react-query";
import { sleep } from "../../../utils/sleep";

export type StoreAsset = Omit<Asset["frontend"], "custom_data"> & {
  custom_data: {
    co2: number;
    temperature: number;
    humidity: number;
    occupancy: number;
  };
};

const storeStatusQueryKeys = {
  byAsset: (params: { assetId: string }) =>
    [{ scope: "storeStatus", params }] as const,
};

async function fetchStoreStatus({
  queryKey: [
    {
      params: { assetId },
    },
  ],
}: QueryFunctionContext<
  ReturnType<typeof storeStatusQueryKeys.byAsset>
>): Promise<StoreAsset> {
  const data = await fetchAssets(new AbortController(), {
    filters: {
      ids: [assetId],
    },
  });

  const asset = data.DATA[0];
  if (typeof asset === "undefined") {
    throw new Error(`No asset found with id '${assetId}'`);
  }

  return asset as unknown as StoreAsset;
}

/**
 * Represents the current status of a store asset
 */
export function useStoreStatusQuery({ assetId }: { assetId: string }) {
  const { subscribe, unsubscribe } = useMessaging();
  const queryClient = useQueryClient();
  useEffect(() => {
    const topics = [`_dbupdate/_monitor/_asset/${assetId}/locationAndStatus`];

    subscribe(topics, (msg) => {
      const assetData = msg.payload as StoreAsset;
      if (!queryClient.isFetching(storeStatusQueryKeys.byAsset({ assetId }))) {
        queryClient.setQueryData<StoreAsset | undefined>(
          storeStatusQueryKeys.byAsset({ assetId }),
          (data) => {
            if (typeof data === "undefined") {
              return assetData;
            }

            return {
              ...data,
              last_updated: assetData.last_updated,
              custom_data: {
                ...data.custom_data,
                ...assetData.custom_data,
              },
            };
          }
        );
      }
    });

    return () => unsubscribe(topics);
  }, [assetId, subscribe, unsubscribe, queryClient]);

  return useQuery(storeStatusQueryKeys.byAsset({ assetId }), {
    queryFn: fetchStoreStatus,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
