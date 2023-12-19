import { Box, Grid, Typography, makeStyles } from "@material-ui/core";
import TrendChart from "./TrendChart";
import { graphChartHeight } from "../../../utils";
import StatsTable from "./StatsTable";
import { useHumidityHistoryQuery } from "../api/humidityHistory";
import { humidityAndTempLabels } from "../utils";

const humidityChartStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
  },
  section: {
    border: `1px solid ${theme.palette.divider}`,
  },
  table: {
    width: "100%",
  },
}));

export default function HumidityCharts({
  assetId,
  current,
}: {
  assetId: string;
  current: number;
}) {
  const classes = humidityChartStyles();
  const {
    data: { stats, data },
  } = useHumidityHistoryQuery({ assetId });

  return (
    <Grid container item spacing={1} className={classes.container}>
      <Grid
        container
        direction="column"
        item
        xs={6}
        className={classes.section}
      >
        <Grid item>
          <TrendChart
            title="Humidity Trend (%)"
            data={[{ ...data, type: "line" }]}
          />
        </Grid>
      </Grid>

      <Grid
        container
        direction="column"
        item
        xs={3}
        className={classes.section}
        alignItems="center"
      >
        <Typography variant="subtitle1">Current Humidity</Typography>
        <Box flex={1} display={"flex"} alignItems={"center"}>
          <Typography variant="h3">{current}%</Typography>
        </Box>
      </Grid>

      <Grid
        container
        item
        xs={3}
        wrap="wrap"
        className={classes.section}
        justifyContent="center"
      >
        <Grid item>
          <Typography variant="subtitle1">Humidity Stats (24 Hrs)</Typography>
        </Grid>
        <Grid item className={classes.table}>
          <StatsTable labels={humidityAndTempLabels} stats={stats} />
        </Grid>
      </Grid>
    </Grid>
  );
}
