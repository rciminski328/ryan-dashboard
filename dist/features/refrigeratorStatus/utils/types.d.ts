interface TimeRange {
    startDate: string;
    endDate: string;
}
export declare enum TimeUnitMultiplier {
    SECONDS = 1,
    MINUTES = 60,
    HOURS = 3600,
    DAYS = 86400,
    WEEKS = 604800,
    MONTHS = 2592000,
    YEARS = 31104000
}
type RelativeTimeRange = {
    type: "relative";
    count: number;
    units: TimeUnitMultiplier;
};
type AbsoluteTimeRange = {
    type: "absolute";
} & TimeRange;
export type RelativeOrAbsoluteRange = RelativeTimeRange | AbsoluteTimeRange;
export {};
