import Plot from "react-plotly.js";
import { graphChartHeight } from "../../../utils";
import { Box, Grid, Typography } from "@material-ui/core";

const plotLayout: Partial<Plotly.Layout> = {
  width: 600,
  height: graphChartHeight - 20,
  margin: {
    b: 20,
    l: 20,
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
        <Box display="flex" justifyContent={"center"}>
          <Plot
            data={data}
            //   onInitialized={(f) => setLayout(f.layout)}
            //   config={{
            //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //     // @ts-ignore
            //     locales: {
            //       [navigator.language]: getLocaleDictionary(navigator.language),
            //     }, // Absent from config type but needed to provide plotly translations.
            //     locale: navigator.language,
            //     responsive: true,
            //     displayModeBar: true,
            //     modeBarButtonsToRemove: ['toImage', 'zoom2d', 'select2d', 'lasso2d'],
            //     displaylogo: false,
            //   }}
            config={{
              displayModeBar: false,
              displaylogo: false,
            }}
            layout={plotLayout}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
