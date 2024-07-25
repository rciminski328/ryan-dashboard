import { Asset } from "@clearblade/ia-mfe-core";
import { RelativeOrAbsoluteRange } from "../../../utils/types";
export type Ws301Asset = Omit<Asset["frontend"], "custom_data"> & {
    custom_data: {
        doorOpen: boolean;
    };
};
export declare function useWs301HistoryQuery({ assetId, timeRange, }: {
    assetId: string;
    timeRange: RelativeOrAbsoluteRange;
}): import("react-query").UseQueryResult<{
    data: {
        doorOpen: {
            x: Date[];
            y: (0 | 1)[];
        };
    };
}, unknown>;
export declare function useLiveDataForWs301({ assetId, timeRange, }: {
    assetId: string;
    timeRange: RelativeOrAbsoluteRange;
}): void;
