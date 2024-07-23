/// <reference types="react" />
import { Axis } from "plotly.js";
type ColorThresholds = {
    value: string;
    min: number;
    max: number;
}[];
export default function GaugeChart({ title, value, units, colorThresholds, minHeight, minWidth, gaugeAxis, }: {
    title: string;
    value: number;
    units: string;
    colorThresholds: ColorThresholds;
    minHeight?: number;
    minWidth?: number;
    gaugeAxis?: Partial<Axis>;
}): JSX.Element;
export {};
