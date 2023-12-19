import Plot from "react-plotly.js";
import { gaugeChartHeight } from "../../../utils";
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
      type: "indicator",
      mode: "gauge+number",
    },
  ];
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Box textAlign={"center"}>
        <Typography variant="subtitle1">{title}</Typography>
      </Box>
      <Plot
        data={data}
        config={{
          displayModeBar: false,
          displaylogo: false,
        }}
        layout={{
          margin: { t: 20, b: 20 },
          width: 300,
          height: gaugeChartHeight - 40,
        }}
      />
    </div>
  );
}
