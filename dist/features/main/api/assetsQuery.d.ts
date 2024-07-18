import { Asset } from "@clearblade/ia-mfe-core";
import { UseQueryResult } from "react-query";
export declare const assetsQueryKeys: {
    all: readonly [{
        readonly scope: "assets";
    }];
};
export declare function useAssetsQuery<TData = Asset["frontend"][]>({ select, }?: {
    select?: (data: Asset["frontend"][]) => TData;
}): UseQueryResult<TData, unknown>;
export declare function useAsset<TAssetShape extends Asset["frontend"]>(assetId: string): UseQueryResult<TAssetShape>;
