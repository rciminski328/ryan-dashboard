import {
  average,
  max,
  median,
  min,
  standardDeviation,
} from "simple-statistics";

export function getStats(values: number[]): {
  count: number;
  min: number;
  max: number;
  average: number;
  median: number;
  stdDev: number;
} {
  if (values.length === 0) {
    return {
      count: 0,
      min: 0,
      max: 0,
      average: 0,
      median: 0,
      stdDev: 0,
    };
  }
  return {
    count: values.length,
    min: min(values),
    max: max(values),
    average: average(values),
    median: median(values),
    stdDev: standardDeviation(values),
  };
}
