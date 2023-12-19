/// <reference types="react" />
export default function StatsTable({ labels, stats, }: {
    labels: {
        label: string;
        field: keyof typeof stats;
        format?: (number: any) => string | number;
    }[];
    stats: Record<string, number>;
}): JSX.Element;
