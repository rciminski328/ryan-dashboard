import {
  Asset,
  createFrontendAssetsQuery,
  fetchAssets,
} from "@clearblade/ia-mfe-core";
import { QueryFunctionContext, useQuery } from "react-query";

export type IndoorEnvironmentStatusAsset = Omit<
  Asset["frontend"],
  "custom_data"
> & {
  custom_data: {
    co2: number;
    temperature: number;
    humidity: number;
    occupancy: number;
  };
};

const indoorEnvironmentStatusQueryKeys = {
  byAsset: (params: { assetId: string }) =>
    [{ scope: "indoorEnvironmentStatus", params }] as const,
};

async function fetchIndoorEnvironmentStatus({
  queryKey: [
    {
      params: { assetId },
    },
  ],
}: QueryFunctionContext<
  ReturnType<typeof indoorEnvironmentStatusQueryKeys.byAsset>
>): Promise<IndoorEnvironmentStatusAsset> {
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

  return asset as unknown as IndoorEnvironmentStatusAsset;
}

export function useIndoorEnvironmentStatusQuery(params: { assetId: string }) {
  return useQuery(indoorEnvironmentStatusQueryKeys.byAsset(params), {
    queryFn: fetchIndoorEnvironmentStatus,
  });
}
