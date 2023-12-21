/// <reference types="react" />
import { useMotionHistoryQuery } from "../api/motionHistory";
export default function MotionCharts({ motionHistoryQuery, current, }: {
    motionHistoryQuery: ReturnType<typeof useMotionHistoryQuery>;
    current: boolean;
}): JSX.Element | null;
