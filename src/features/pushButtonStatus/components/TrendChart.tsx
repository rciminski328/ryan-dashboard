import Plot from "react-plotly.js";
import { graphChartHeight } from "../../../utils";
import { Box, Grid, Typography } from "@material-ui/core";

const plotLayout: Partial<Plotly.Layout> = {
  autosize: true,
  margin: {
    b: 20,
    l: 30,
    r: 20,
    t: 20,
  },
  hovermode: "x unified",
  xaxis: {
    hoverformat: "<b>%m/%d/%y, %I:%M:%S.%L %p</b>",
    tickformatstops: [
      {
        dtickrange: [null, 1000],
        value: "%I:%M:%S.%L %p",
      },
      {
        dtickrange: [1000, 60000],
        value: "%I:%M:%S %p",
      },
      {
        dtickrange: [60000, 3600000],
        value: "%I:%M %p",
      },
      {
        dtickrange: [3600000, 86400000],
        value: "%I:%M %p",
      },
      {
        dtickrange: [86400000, 604800000],
        value: "%b %d",
      },
      {
        dtickrange: [604800000, "M1"],
        value: "%b %d",
      },
      {
        dtickrange: ["M1", "M12"],
        value: "%b %Y",
      },
      {
        dtickrange: ["M12", null],
        value: "%Y",
      },
    ],
  },
};

export default function TrendChart({
  data,
  title,
}: {
  data: Plotly.Data[];
  title: string;
}) {
  return (
    <Grid>
      <Grid item>
        <Box ml={1}>
          <Typography variant="subtitle1">{title}</Typography>
        </Box>
      </Grid>
      <Grid item>
        <Plot
          data={data}
          config={{
            displayModeBar: false,
            displaylogo: false,
            responsive: true,
          }}
          style={{
            width: "100%",
            height: "100%",
            minHeight: graphChartHeight,
          }}
          layout={plotLayout}
        />
      </Grid>
    </Grid>
  );
}
