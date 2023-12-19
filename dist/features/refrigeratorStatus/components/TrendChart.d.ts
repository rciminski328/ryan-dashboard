/// <reference types="react" />
export default function TrendChart({ data, title, }: {
    data: {
        type: "line";
        x: string[];
        y: number[];
    }[];
    title: string;
}): JSX.Element;
