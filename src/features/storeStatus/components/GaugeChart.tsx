import Plot from "react-plotly.js";
import { gaugeChartHeight, gaugeChartWidth } from "../../../utils";
import { Box, Typography, useTheme } from "@material-ui/core";
import { getThresholdValue } from "../utils";
import { ColorThresholds } from "../types";

export default function GaugeChart({
  title,
  value,
  units,
  colorThresholds,
}: {
  title: string;
  value: number;
  units: string;
  colorThresholds?: ColorThresholds;
}) {
  const theme = useTheme();
  const barColor = colorThresholds
    ? getThresholdValue({ value, thresholds: colorThresholds }) ??
      theme.palette.text.primary
    : theme.palette.text.primary;
  const data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value,
      number: { suffix: units },
      type: "indicator" as const,
      mode: "gauge+number" as const,
      gauge: {
        bar: { color: barColor },
      },
    },
  ];
  return (
    <>
      <Box textAlign={"center"}>
        <Typography variant="subtitle1">{title}</Typography>
      </Box>
      <Plot
        data={data}
        config={{
          responsive: true,
          displayModeBar: false,
          displaylogo: false,
        }}
        layout={{
          autosize: true,
          margin: { t: 20, b: 20 },
        }}
        style={{
          width: "100%",
          height: "100%",
          minHeight: gaugeChartHeight,
          minWidth: gaugeChartWidth,
        }}
      />
    </>
  );
}
