/// <reference types="react" />
import { useDoorOpenHistoryQuery } from "../api/doorOpenHistory";
export default function DoorCharts({ doorOpenHistoryQuery, current, }: {
    doorOpenHistoryQuery: ReturnType<typeof useDoorOpenHistoryQuery>;
    current: boolean;
}): JSX.Element | null;
