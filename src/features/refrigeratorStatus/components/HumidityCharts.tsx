import { Box, Grid, Typography, makeStyles, useTheme } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import GaugeChart from "../../storeStatus/components/GaugeChart";
import { useHumidityHistoryQuery } from "../api/humidityHistory";
import {
  getFridgeHumidityThresholds,
  humidityAndTempLabels,
  smallGaugeChartHeight,
  smallGaugeChartWidth,
} from "../utils";
import StatsTable from "./StatsTable";
import TrendChart from "./TrendChart";

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
  current,
  humidityHistoryQuery,
}: {
  humidityHistoryQuery: ReturnType<typeof useHumidityHistoryQuery>;
  current: number;
}) {
  const theme = useTheme();
  const classes = humidityChartStyles();

  if (humidityHistoryQuery.isLoading) {
    return (
      <Grid container item spacing={1} className={classes.container}>
        <Box pt={1} />
        <Skeleton variant="rect" height={200} width="100%" />
      </Grid>
    );
  }

  if (!humidityHistoryQuery.isSuccess) {
    return null;
  }

  const { data, stats } = humidityHistoryQuery.data;

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
            data={[{ ...data, type: "scatter" }]}
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
        justifyContent="center"
      >
        <Grid item>
          <GaugeChart
            title="Current Humidity"
            units=" %"
            value={current}
            colorThresholds={getFridgeHumidityThresholds(theme)}
            minHeight={smallGaugeChartHeight}
            minWidth={smallGaugeChartWidth}
          />
        </Grid>
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
          <Typography variant="subtitle1">Humidity Stats</Typography>
        </Grid>
        <Grid item className={classes.table}>
          <StatsTable labels={humidityAndTempLabels} stats={stats} />
        </Grid>
      </Grid>
    </Grid>
  );
}
