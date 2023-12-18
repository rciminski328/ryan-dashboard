import {
  Asset,
  createFrontendAssetsQuery,
  fetchAssets,
} from "@clearblade/ia-mfe-core";
import { QueryFunctionContext, useQuery } from "react-query";

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
    query: createFrontendAssetsQuery({
      Filters: [
        [{ type: "default", operator: "=", field: "id", value: assetId }],
      ],
    }),
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
export function useStoreStatusQuery(params: { assetId: string }) {
  return useQuery(storeStatusQueryKeys.byAsset(params), {
    queryFn: fetchStoreStatus,
  });
}
