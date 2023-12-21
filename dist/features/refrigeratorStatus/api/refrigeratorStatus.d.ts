import { Asset } from "@clearblade/ia-mfe-core";
export type RefrigeratorAsset = Omit<Asset["frontend"], "custom_data"> & {
    custom_data: {
        temperature: number;
        humidity: number;
        isRunning: boolean;
        doorOpen: boolean;
        motion?: boolean;
        motionCount?: number;
    };
};
export declare const refrigeratorStatusQueryKeys: {
    byAsset: (params: {
        assetId: string;
    }) => readonly [{
        readonly scope: "refrigeratorStatus";
        readonly params: {
            assetId: string;
        };
    }];
};
/**
 * Represents the current status of a refrigerator asset
 */
export declare function useRefrigeratorStatusQuery({ assetId }: {
    assetId: string;
}): import("react-query").UseQueryResult<RefrigeratorAsset, unknown>;
