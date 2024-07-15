import { fetchAssets } from "@clearblade/ia-mfe-core";
import { useQuery } from "react-query";

export function useAssetsQuery() {
  return useQuery({
    queryKey: [{ scope: "assets" }],
    queryFn: async () => {
      const data = await fetchAssets(new AbortController(), {
        filters: {
          types: ["EM300-TH", "WS202", "WS101", "WS303", "AM103L", "WS301"],
        },
      });
      return data.DATA;
    },
    refetchOnWindowFocus: false,
  });
}
