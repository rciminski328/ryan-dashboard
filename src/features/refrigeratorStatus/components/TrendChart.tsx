import Plot from "react-plotly.js";
import { graphChartHeight } from "../../../utils";
import { Box, Grid, Typography } from "@material-ui/core";

export default function TrendChart({
  data,
  title,
}: {
  data: { type: "line"; x: Date[]; y: number[] }[];
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
            layout={{
              width: 600,
              height: graphChartHeight - 20,
              margin: {
                b: 20,
                l: 20,
                r: 20,
                t: 20,
              },
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
