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
  if (values.length === 0) {
    return {
      min: 0,
      max: 0,
      average: 0,
      median: 0,
      stdDev: 0,
    };
  }
  return {
    min: min(values),
    max: max(values),
    average: average(values),
    median: median(values),
    stdDev: standardDeviation(values),
  };
}
