import Plot from "react-plotly.js";
import { gaugeChartHeight, gaugeChartWidth } from "../../../utils";
import { Box, Typography } from "@material-ui/core";

export default function GaugeChart({
  title,
  value,
  units,
}: {
  title: string;
  value: number;
  units: string;
}) {
  const data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value,
      number: { suffix: units },
      type: "indicator" as const,
      mode: "gauge+number" as const,
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
