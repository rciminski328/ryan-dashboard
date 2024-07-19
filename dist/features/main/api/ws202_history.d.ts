import { Asset } from "@clearblade/ia-mfe-core";
import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";
export type Ws202Asset = Omit<Asset["frontend"], "custom_data"> & {
    custom_data: {
        motion: boolean;
        daylight: boolean;
    };
};
export declare function useWs202HistoryQuery({ assetId, timeRange, }: {
    assetId: string;
    timeRange: RelativeOrAbsoluteRange;
}): import("react-query").UseQueryResult<{
    daylight: {
        x: Date[];
        y: (0 | 1)[];
        count: number;
    };
    motion: {
        x: Date[];
        y: (0 | 1)[];
        count: number;
    };
}, unknown>;
export declare function useLiveDataForWs202({ assetId, timeRange, }: {
    assetId: string;
    timeRange: RelativeOrAbsoluteRange;
}): void;
