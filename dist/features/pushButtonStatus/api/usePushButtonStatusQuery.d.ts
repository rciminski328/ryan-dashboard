interface PushButtonStatusResponse {
    currentStatus: boolean;
    x: string[];
    y: number[];
}
export declare function usePushButtonStatusQuery({ assetId }: {
    assetId: string;
}): import("react-query").UseQueryResult<PushButtonStatusResponse, unknown>;
export {};
