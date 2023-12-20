import { RelativeOrAbsoluteRange } from "../utils/types";
export declare const doorOpenHistoryQueryKeys: {
    byAsset: (params: {
        assetId: string;
        timeRange: RelativeOrAbsoluteRange;
    }) => readonly [{
        readonly scope: "doorOpenHistory";
        readonly params: {
            assetId: string;
            timeRange: RelativeOrAbsoluteRange;
        };
    }];
};
export declare function useDoorOpenHistoryQuery(params: {
    assetId: string;
    timeRange: RelativeOrAbsoluteRange;
}): import("react-query").UseQueryResult<{
    data: {
        x: Date[];
        y: number[];
    };
    stats: {
        times: number;
        averageDurationMs: number;
    };
}, unknown>;
