import { Asset } from "@clearblade/ia-mfe-core";
export type StoreAsset = Omit<Asset["frontend"], "custom_data"> & {
    custom_data: {
        co2: number;
        temperature: number;
        humidity: number;
        occupancy: number;
    };
};
/**
 * Represents the current status of a store asset
 */
export declare function useStoreStatusQuery({ assetId }: {
    assetId: string;
}): import("react-query").UseQueryResult<StoreAsset, unknown>;
