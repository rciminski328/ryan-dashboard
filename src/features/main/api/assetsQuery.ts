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
        console.log(data.DATA)
        return data.DATA || [];
      } catch (error) {
        console.error("Error fetching assets:", error);
        return []; // Return an empty array in case of error
      }
    },
    refetchOnWindowFocus: false,
    select: (data) => {
      console.log('This is within function:' , data);
      const sortedData = data.sort((a, b) => {
        const labelA = a.label?.toLowerCase().trim() || a.id?.toLowerCase().trim() || "";
        const labelB = b.label?.toLowerCase().trim() || b.id?.toLowerCase().trim() || "";
        return labelA.localeCompare(labelB);
      });
      console.log('this is sorted data:', sortedData);
      // Ensure assets with no data reporting are included
      sortedData.forEach((asset) => {
        if (!asset.custom_data) {
          asset.custom_data = {};
        }
        if (!asset.custom_data.Reporting) {
          asset.custom_data.Reporting = "No data reporting";
        }
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
