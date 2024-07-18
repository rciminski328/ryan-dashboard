import { Asset } from "@clearblade/ia-mfe-core";
import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";
export type Ws101Asset = Omit<Asset["frontend"], "custom_data"> & {
    custom_data: {
        button_pushed: boolean;
    };
};
export declare function useWs101HistoryQuery({ assetId, timeRange, }: {
    assetId: string;
    timeRange: RelativeOrAbsoluteRange;
}): import("react-query").UseQueryResult<{
    data: {
        button_pushed: {
            x: Date[];
            y: (0 | 1)[];
        };
    };
}, unknown>;
export declare function useLiveDataForWs101({ assetId, timeRange, }: {
    assetId: string;
    timeRange: RelativeOrAbsoluteRange;
}): void;
