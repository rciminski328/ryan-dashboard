import { Box, Grid, Typography, makeStyles } from "@material-ui/core";
import TrendChart from "./TrendChart";
import StatsTable from "./StatsTable";
import { useTemperatureHistoryQuery } from "../api/temperatureHistory";
import { humidityAndTempLabels } from "../utils";
import { Skeleton } from "@material-ui/lab";

const tempChartStyles = makeStyles((theme) => ({
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

export default function TemperatureCharts({
  temperatureHistoryQuery,
  current,
}: {
  temperatureHistoryQuery: ReturnType<typeof useTemperatureHistoryQuery>;
  current: number;
}) {
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
      >
        <Typography variant="subtitle1">Current Temperature</Typography>
        <Box flex={1} display={"flex"} alignItems={"center"}>
          <Typography variant="h4">{current}°F</Typography>
        </Box>
        <Typography variant="caption">
          Raw Sensor: {fahrenheitToCelsius(current).toFixed(1)}°C
        </Typography>
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
          <Typography variant="subtitle1">
            Temperature Stats (24 Hrs)
          </Typography>
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
