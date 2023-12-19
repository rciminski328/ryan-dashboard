import Plot from "react-plotly.js";
import { gaugeChartHeight } from "../../../utils";

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
      title: { text: `${title} (${units})` },
      type: "indicator",
      mode: "gauge+number",
    },
  ];
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Plot
        data={data}
        config={{
          displayModeBar: false,
          displaylogo: false,
        }}
        layout={{
          margin: { t: 0, b: 0 },
          width: 300,
          height: gaugeChartHeight + 40,
          // datarevision: revision,
        }}
        useResizeHandler

        // revision={revision}
        //   useResizeHandler
        //   className={classes.plot}
      />
    </div>
  );
}
