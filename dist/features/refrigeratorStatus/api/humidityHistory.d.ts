import { RelativeOrAbsoluteRange } from "../utils/types";
export declare const humidityHistoryQueryKeys: {
    byAsset: (params: {
        assetId: string;
        timeRange: RelativeOrAbsoluteRange;
    }) => readonly [{
        readonly scope: "humidityHistory";
        readonly params: {
            assetId: string;
            timeRange: RelativeOrAbsoluteRange;
        };
    }];
};
export declare function useHumidityHistoryQuery(params: {
    assetId: string;
    timeRange: RelativeOrAbsoluteRange;
}): import("react-query").UseQueryResult<{
    data: {
        x: Date[];
        y: number[];
    };
    stats: {
        count: number;
        min: number;
        max: number;
        average: number;
        median: number;
        stdDev: number;
    };
}, unknown>;
