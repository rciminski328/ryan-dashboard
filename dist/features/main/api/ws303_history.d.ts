import { Asset } from "@clearblade/ia-mfe-core";
import { RelativeOrAbsoluteRange } from "../../../utils/types";
export type Ws303Asset = Omit<Asset["frontend"], "custom_data"> & {
    custom_data: {
        leak_detected: boolean;
    };
};
export declare function useWs303HistoryQuery({ assetId, timeRange, }: {
    assetId: string;
    timeRange: RelativeOrAbsoluteRange;
}): import("react-query").UseQueryResult<{
    data: {
        leak_detected: {
            x: Date[];
            y: (0 | 1)[];
        };
    };
}, unknown>;
export declare function useLiveDataForWs303({ assetId, timeRange, }: {
    assetId: string;
    timeRange: RelativeOrAbsoluteRange;
}): void;
