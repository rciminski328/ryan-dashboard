/// <reference types="react" />
import { ColorThresholds } from "../types";
export default function GaugeChart({ title, value, units, colorThresholds, minHeight, minWidth, }: {
    title: string;
    value: number;
    units: string;
    colorThresholds?: ColorThresholds;
    minHeight?: number;
    minWidth?: number;
}): JSX.Element;
