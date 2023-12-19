export declare const humidityHistoryQueryKeys: {
    byAsset: (params: {
        assetId: string;
    }) => readonly [{
        readonly scope: "humidityHistory";
        readonly params: {
            assetId: string;
        };
    }];
};
export declare function useHumidityHistoryQuery(params: {
    assetId: string;
}): import("react-query").UseQueryResult<{
    data: {
        x: string[];
        y: number[];
    };
    stats: {
        min: number;
        max: number;
        average: number;
        median: number;
        stdDev: number;
    };
}, unknown>;
