import { RelativeOrAbsoluteRange } from "./types";
export * from "./constants";
export * from "./colorThresholds";
export declare function getTimeRangeParametersForPlot(timeRange: RelativeOrAbsoluteRange): {
    startDate: string;
    endDate: string;
};
