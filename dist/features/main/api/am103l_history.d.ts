import { Asset } from "@clearblade/ia-mfe-core";
import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";
export type Am103LAsset = Omit<Asset["frontend"], "custom_data"> & {
    custom_data: {
        temperature: number;
        humidity: number;
        co2: number;
    };
};
export declare function useAm103LHistoryQuery({ assetId, timeRange, }: {
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
        co2: {
            x: Date[];
            y: number[];
        };
    };
    stats: {
        temperature: {
            min: number;
            max: number;
            average: number;
            median: number;
            stdDev: number;
        };
        humidity: {
            min: number;
            max: number;
            average: number;
            median: number;
            stdDev: number;
        };
        co2: {
            min: number;
            max: number;
            average: number;
            median: number;
            stdDev: number;
        };
    };
}, unknown>;
export declare function useLiveDataForAm103L({ assetId, timeRange, }: {
    assetId: string;
    timeRange: RelativeOrAbsoluteRange;
}): void;
