export declare const doorOpenHistoryQueryKeys: {
    byAsset: (params: {
        assetId: string;
    }) => readonly [{
        readonly scope: "doorOpenHistory";
        readonly params: {
            assetId: string;
        };
    }];
};
export declare function useDoorOpenHistoryQuery(params: {
    assetId: string;
}): import("react-query").UseQueryResult<{
    data: {
        x: string[];
        y: number[];
    };
    stats: {
        times: number;
        averageDurationMs: number;
    };
}, unknown>;
