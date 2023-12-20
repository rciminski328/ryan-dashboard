/// <reference types="react" />
import { useHumidityHistoryQuery } from "../api/humidityHistory";
export default function HumidityCharts({ current, humidityHistoryQuery, }: {
    humidityHistoryQuery: ReturnType<typeof useHumidityHistoryQuery>;
    current: number;
}): JSX.Element | null;
