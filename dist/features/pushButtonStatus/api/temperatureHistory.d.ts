import { RelativeOrAbsoluteRange } from "../utils/types";
export declare const temperatureHistoryQueryKeys: {
    byAsset: (params: {
        assetId: string;
        timeRange: RelativeOrAbsoluteRange;
    }) => readonly [{
        readonly scope: "temperatureHistory";
        readonly params: {
            assetId: string;
            timeRange: RelativeOrAbsoluteRange;
        };
    }];
};
export declare function useTemperatureHistoryQuery(params: {
    assetId: string;
    timeRange: RelativeOrAbsoluteRange;
}): import("react-query").UseQueryResult<{
    data: {
        x: Date[];
        y: number[];
    };
    stats: any;
}, unknown>;
