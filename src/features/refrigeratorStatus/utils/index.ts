import { RelativeOrAbsoluteRange } from "./types";

export * from "./constants";

export function getTimeRangeParametersForPlot(
  timeRange: RelativeOrAbsoluteRange
): { startDate: string; endDate: string } {
  if (timeRange.type === "relative") {
    const startDate = new Date(
      Date.now() - timeRange.count * timeRange.units * 1000
    );
    const endDate = new Date();

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }

  return {
    startDate: timeRange.startDate,
    endDate: timeRange.endDate,
  };
}
