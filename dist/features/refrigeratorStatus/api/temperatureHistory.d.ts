export declare const temperatureHistoryQueryKeys: {
    byAsset: (params: {
        assetId: string;
    }) => readonly [{
        readonly scope: "temperatureHistory";
        readonly params: {
            assetId: string;
        };
    }];
};
export declare function useTemperatureHistoryQuery(params: {
    assetId: string;
}): import("react-query").UseQueryResult<{
    data: {
        x: Date[];
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
