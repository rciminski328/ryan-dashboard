import { RelativeOrAbsoluteRange } from "../utils/types";
export declare const motionHistoryQueryKeys: {
    byAsset: (params: {
        assetId: string;
        timeRange: RelativeOrAbsoluteRange;
    }) => readonly [{
        readonly scope: "motionHistory";
        readonly params: {
            assetId: string;
            timeRange: RelativeOrAbsoluteRange;
        };
    }];
};
export declare function useMotionHistoryQuery(params: {
    assetId: string;
    timeRange: RelativeOrAbsoluteRange;
}): import("react-query").UseQueryResult<{
    data: {
        x: Date[];
        y: number[];
    };
    stats: {
        count: number;
        averageDurationMs: number;
    };
}, unknown>;
