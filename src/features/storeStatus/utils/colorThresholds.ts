import { ColorThresholds } from "../types";

export const MOCK_THRESHOLDS: ColorThresholds = [
  { value: "red", min: -Infinity, max: 10 },
  { value: "yellow", min: 10, max: 69 },
  { value: "green", min: 69, max: Infinity },
];
