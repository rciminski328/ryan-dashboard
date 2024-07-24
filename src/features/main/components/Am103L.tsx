// Am103L.tsx
import {
  Box,
  Card,
  Divider,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import Plot from "react-plotly.js";
import { RelativeOrAbsoluteRange } from "../../../utils/types";
import {
  Am103LAsset,
  useAm103LHistoryQuery,
  useLiveDataForAm103L,
} from "../api/am103l_history";
import { useAsset } from "../api/assetsQuery";

const useStyles = makeStyles((theme) => ({
  borderRight: {
    [theme.breakpoints.up("md")]: {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
  },
  statusContainer: {
    display: "flex",
    justifyContent: "center",
  },
  table: {
    width: "100%",
  },
  label: {
    marginBottom: theme.spacing(2),
  },
  plot: {
    width: "100%",
    height: 300,
  },
  statsTable: {
    marginTop: theme.spacing(2),
    "& th, & td": {
      padding: theme.spacing(1),
    },
  },
}));

const chartHeight = 300;

const Am103L: React.FC<{
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}> = ({ assetId, timeRange }) => {
  const classes = useStyles();

  const assetQuery = useAsset<Am103LAsset>(assetId);

  const { data: historyData } = useAm103LHistoryQuery({
    assetId: assetId,
    timeRange,
  });

  useLiveDataForAm103L({
    assetId: assetId,
    timeRange,
  });

  if (assetQuery.isLoading || !historyData) {
    return <div>Loading...</div>;
  }

  if (assetQuery.isError) {
    return <div>Error loading data</div>;
  }

  if (!assetQuery.isSuccess) {
    return null;
  }

  const custom_data = assetQuery.data.custom_data;
  const label = assetQuery.data.label;

  const temperatureStats = historyData.stats.temperature;
  const humidityStats = historyData.stats.humidity;
  const co2Stats = historyData.stats.co2;

  const renderPlot = (
    title: string,
    x: any[],
    y: any[],
    yLabel: string,
    color: string
  ) => (
    <Plot
      data={[
        {
          x: x,
          y: y,
          type: "scatter",
          mode: "lines+markers",
          marker: { color: color },
        },
      ]}
      layout={{
        title: title,
        xaxis: {
          title: { text: "Time", standoff: 20 },
          tickformat: "%I:%M %p",
          nticks: 10,
        },
        yaxis: { title: yLabel },
        height: 300,
        margin: { t: 40, b: 60, l: 40, r: 40 },
      }}
      className={classes.plot}
    />
  );

  const renderGauge = (value: number, max: number, title: string) => (
    <Plot
      data={[
        {
          type: "indicator",
          mode: "gauge+number",
          value: value,
          title: { text: title },
          gauge: {
            axis: { range: [0, max] },
            steps: [
              { range: [0, max * 0.33], color: "lightgray" },
              { range: [max * 0.33, max * 0.66], color: "gray" },
              { range: [max * 0.66, max], color: "darkgray" },
            ],
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: value,
            },
          },
        },
      ]}
      layout={{ width: 300, height: 300, margin: { t: 0, b: 0 } }}
    />
  );

  const renderStatsTable = (stats: any, title: string) => (
    <Grid item xs={3}>
      <Typography variant="subtitle1">
        <strong>{title}</strong>
      </Typography>
      <table className={classes.statsTable}>
        <thead>
          <tr>
            <th>Statistic</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Min</td>
            <td>{stats.min}</td>
          </tr>
          <tr>
            <td>Max</td>
            <td>{stats.max}</td>
          </tr>
          <tr>
            <td>Average</td>
            <td>{stats.average.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Median</td>
            <td>{stats.median}</td>
          </tr>
          <tr>
            <td>Std Dev</td>
            <td>{stats.stdDev.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </Grid>
  );

  return (
    <Card>
      <Grid container spacing={3}>
        {/* Temperature Section */}
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={12} md={6} className={classes.borderRight}>
            <Typography variant="subtitle1">
              <strong>{`${label} - Temperature Trend (°C)`}</strong>
            </Typography>
            {renderPlot(
              "Temperature Trend",
              historyData.data.temperature.x,
              historyData.data.temperature.y,
              "Temperature (°C)",
              "blue"
            )}
          </Grid>

          <Grid
            item
            xs={12}
            md={3}
            className={`${classes.borderRight} ${classes.statusContainer}`}
          >
            <Typography variant="subtitle1">
              <strong>Current Temperature</strong>
            </Typography>
            {renderGauge(
              custom_data.temperature,
              60,
              "Current Temperature (°C)"
            )}
          </Grid>

          <Grid item xs={12} md={3} className={classes.statusContainer}>
            {renderStatsTable(temperatureStats, "Temperature Stats")}
          </Grid>
        </Grid>

        {/* Horizontal Divider */}
        <Grid item xs={12}>
          <Box pt={0.5}>
            <Divider />
          </Box>
        </Grid>

        {/* Humidity Section */}
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6} className={classes.borderRight}>
            <Typography variant="subtitle1">
              <strong>{`${label} - Humidity Trend (%)`}</strong>
            </Typography>
            {renderPlot(
              "Humidity Trend",
              historyData.data.humidity.x,
              historyData.data.humidity.y,
              "Humidity (%)",
              "green"
            )}
          </Grid>

          <Grid item xs={3} className={classes.borderRight}>
            <Typography variant="subtitle1">
              <strong>Current Humidity</strong>
            </Typography>
            {renderGauge(custom_data.humidity, 100, "Current Humidity (%)")}
          </Grid>
          <Grid item xs={12} md={3} className={classes.statusContainer}>
            {renderStatsTable(humidityStats, "Humidity Stats")}
          </Grid>
        </Grid>

        {/* Horizontal Divider */}
        <Grid item xs={12}>
          <Box pt={0.5}>
            <Divider />
          </Box>
        </Grid>

        {/* CO2 Section */}
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={12} md={6} className={classes.borderRight}>
            <Typography variant="subtitle1">
              <strong>{`${label} - CO22 Trend (ppm)`}</strong>
            </Typography>
            {renderPlot(
              "CO2 Trend",
              historyData.data.co2.x,
              historyData.data.co2.y,
              "CO2 (ppm)",
              "red"
            )}
          </Grid>

          <Grid item xs={12} md={3} className={classes.borderRight}>
            <Typography variant="subtitle1">
              <strong>Current CO2</strong>
            </Typography>
            {renderGauge(custom_data.co2, 2000, "Current CO2 (ppm)")}
          </Grid>

          <Grid item xs={12} md={3} className={classes.statusContainer}>
            {renderStatsTable(co2Stats, "CO2 Stats")}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Am103L;
