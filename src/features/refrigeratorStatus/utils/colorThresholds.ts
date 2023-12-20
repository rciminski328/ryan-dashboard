import { Theme } from "@material-ui/core";
import { ColorThresholds } from "../../storeStatus/types";

export const getFridgeTempThresholds = (theme: Theme): ColorThresholds => [
  { value: theme.palette.error.main, min: -Infinity, max: 35 },
  { value: theme.palette.success.main, min: 35, max: 40 },
  { value: theme.palette.warning.main, min: 40, max: 48 },
  { value: theme.palette.error.main, min: 48, max: Infinity },
];

export const getFridgeHumidityThresholds = (theme: Theme): ColorThresholds => [
  { value: theme.palette.error.main, min: -Infinity, max: 20 },
  { value: theme.palette.warning.main, min: 20, max: 30 },
  { value: theme.palette.success.main, min: 30, max: 50 },
  { value: theme.palette.warning.main, min: 50, max: 60 },
  { value: theme.palette.error.main, min: 60, max: Infinity },
];
