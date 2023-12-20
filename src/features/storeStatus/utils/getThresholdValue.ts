import { ColorThresholds } from "../types";

export const getThresholdValue = ({
  value,
  thresholds,
}: {
  value: number;
  thresholds: ColorThresholds;
}): string | undefined => {
  const sortedThresholds = thresholds.sort((a, b) => {
    if (a.min < b.min) return -1;
    if (a.min === b.min) {
      return a.max < b.max ? -1 : 1;
    }
    return 1;
  });
  const matchingThreshold = sortedThresholds.find(
    (threshold) => value >= threshold.min && value < threshold.max
  );
  return matchingThreshold?.value;
};
