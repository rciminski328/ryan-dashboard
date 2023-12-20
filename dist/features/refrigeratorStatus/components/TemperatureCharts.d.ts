/// <reference types="react" />
import { useTemperatureHistoryQuery } from "../api/temperatureHistory";
export default function TemperatureCharts({ temperatureHistoryQuery, current, }: {
    temperatureHistoryQuery: ReturnType<typeof useTemperatureHistoryQuery>;
    current: number;
}): JSX.Element | null;
