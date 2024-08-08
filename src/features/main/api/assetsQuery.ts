import { Asset, fetchAssets } from "@clearblade/ia-mfe-core";
import { useQuery, UseQueryResult } from "react-query";

export const assetsQueryKeys = {
  all: [{ scope: "assets" }] as const,
};

export function useAssetsQuery<TData = Asset["frontend"][]>({
  select,
}: { select?: (data: Asset["frontend"][]) => TData } = {}) {
  return useQuery({
    queryKey: assetsQueryKeys.all,
    queryFn: async () => {
      try {
        const data = await fetchAssets(new AbortController(), {
          filters: {
            types: ["EM300-TH", "WS202", "WS101", "WS303", "AM103L", "WS301"],
          },
        });
        return data.DATA || [];
      } catch (error) {
        console.error("Error fetching assets:", error);
        return []; // Return an empty array in case of error
      }
    },
    refetchOnWindowFocus: false,
    select: (data) => {
      const sortedData = data.sort((a, b) => {
        const labelA = a.label?.toLowerCase() || a.id?.toLowerCase() || "";
        const labelB = b.label?.toLowerCase() || b.id?.toLowerCase() || "";
        return labelA.localeCompare(labelB);
      });
      return select ? select(sortedData) : sortedData;
    },
  });
}

export function useAsset<TAssetShape extends Asset["frontend"]>(
  assetId: string
): UseQueryResult<TAssetShape> {
  return useAssetsQuery({
    select: (data) => data.find((asset) => asset.id === assetId),
  }) as UseQueryResult<TAssetShape>;
}
