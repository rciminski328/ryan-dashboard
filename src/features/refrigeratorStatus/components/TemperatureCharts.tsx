import {
  Box,
  Card,
  Grid,
  Typography,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import GaugeChart from "../../storeStatus/components/GaugeChart";
import { useTemperatureHistoryQuery } from "../api/temperatureHistory";
import {
  getFridgeTempThresholds,
  humidityAndTempLabels,
  smallGaugeChartHeight,
  smallGaugeChartWidth,
} from "../utils";
import StatsTable from "./StatsTable";
import TrendChart from "./TrendChart";

const tempChartStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
  },
  section: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  table: {
    width: "100%",
  },
}));

export default function TemperatureCharts({
  temperatureHistoryQuery,
  current,
}: {
  temperatureHistoryQuery: ReturnType<typeof useTemperatureHistoryQuery>;
  current: number;
}) {
  const theme = useTheme();
  const classes = tempChartStyles();

  if (temperatureHistoryQuery.isLoading) {
    return (
      <Grid container item spacing={1} className={classes.container}>
        <Box pt={1} />
        <Skeleton variant="rect" height={200} width="100%" />
      </Grid>
    );
  }

  if (!temperatureHistoryQuery.isSuccess) {
    return null;
  }

  const { data, stats } = temperatureHistoryQuery.data;

  return (
    <Grid
      container
      item
      spacing={1}
      className={classes.container}
      component={Card}
    >
      <Grid
        container
        direction="column"
        item
        xs={6}
        className={classes.section}
      >
        <Grid item>
          <TrendChart
            title="Temperature Trend (°F)"
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
            title="Current Temperature"
            units=" °F"
            value={current}
            colorThresholds={getFridgeTempThresholds(theme)}
            minHeight={smallGaugeChartHeight}
            minWidth={smallGaugeChartWidth}
          />
        </Grid>
        <Grid item>
          <Typography variant="caption">
            Raw Sensor: {fahrenheitToCelsius(current).toFixed(1)}°C
          </Typography>
        </Grid>
      </Grid>

      <Grid container item xs={3} wrap="wrap" justifyContent="center">
        <Grid item>
          <Typography variant="subtitle1">Temperature Stats</Typography>
        </Grid>
        <Grid item className={classes.table}>
          <StatsTable labels={humidityAndTempLabels} stats={stats} />
        </Grid>
      </Grid>
    </Grid>
  );
}

function fahrenheitToCelsius(fahrenheit: number) {
  return ((fahrenheit - 32) * 5) / 9;
}
