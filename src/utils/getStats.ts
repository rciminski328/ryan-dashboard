import {
  min,
  max,
  median,
  average,
  standardDeviation,
} from "simple-statistics";

export function getStats(values: number[]): {
  min: number;
  max: number;
  average: number;
  median: number;
  stdDev: number;
} {
  return {
    min: min(values),
    max: max(values),
    average: average(values),
    median: median(values),
    stdDev: standardDeviation(values),
  };
}
