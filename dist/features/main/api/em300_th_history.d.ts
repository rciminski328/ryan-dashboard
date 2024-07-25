import { Asset } from "@clearblade/ia-mfe-core";
import { RelativeOrAbsoluteRange } from "../../../utils/types";
export type Em300ThAsset = Omit<Asset["frontend"], "custom_data"> & {
    custom_data: {
        temperature: number;
        humidity: number;
    };
};
export declare function useEm300ThHistoryQuery({ assetId, timeRange, }: {
    assetId: string;
    timeRange: RelativeOrAbsoluteRange;
}): import("react-query").UseQueryResult<{
    data: {
        temperature: {
            x: Date[];
            y: number[];
        };
        humidity: {
            x: Date[];
            y: number[];
        };
    };
    stats: {
        temperature: {
            count: number;
            min: number;
            max: number;
            average: number;
            median: number;
            stdDev: number;
        };
        humidity: {
            count: number;
            min: number;
            max: number;
            average: number;
            median: number;
            stdDev: number;
        };
    };
}, unknown>;
export declare function useLiveDataForEm300Th({ assetId, timeRange, }: {
    assetId: string;
    timeRange: RelativeOrAbsoluteRange;
}): void;
