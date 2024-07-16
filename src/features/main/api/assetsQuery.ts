import { Asset, fetchAssets } from "@clearblade/ia-mfe-core";
import { useQuery } from "react-query";

export const assetsQueryKeys = {
  all: [{ scope: "assets" }] as const,
};

export function useAssetsQuery<TData = Asset["frontend"][]>({
  select,
}: { select?: (data: Asset["frontend"][]) => TData } = {}) {
  return useQuery({
    queryKey: assetsQueryKeys.all,
    queryFn: async () => {
      const data = await fetchAssets(new AbortController(), {
        filters: {
          types: ["EM300-TH", "WS202", "WS101", "WS303", "AM103L", "WS301"],
        },
      });
      return data.DATA;
    },
    refetchOnWindowFocus: false,
    select,
  });
}

export function useAsset(assetId: string) {
  return useAssetsQuery({
    select: (data) => data.find((asset) => asset.id === assetId),
  });
}
