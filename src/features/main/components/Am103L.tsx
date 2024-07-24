// Am103L.tsx
import { Card, Grid, Typography, makeStyles } from "@material-ui/core";
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
  container: {
    width: "100%",
  },
  section: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  table: {
    width: "100%",
  },
  plot: {
    width: "100%",
    height: 300,
  },
  label: {
    marginBottom: theme.spacing(2),
  },
  statsTable: {
    marginTop: theme.spacing(2),
    "& th, & td": {
      padding: theme.spacing(1),
    },
  },
}));

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

  return (
    <Card>
      <Grid container spacing={1} className={classes.container}>
        {/* Temperature Section */}
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <Typography variant="subtitle1">
              <strong>{`${label} - Temperature Trend (°C)`}</strong>
            </Typography>
            <Plot
              data={[
                {
                  x: historyData.data.temperature.x,
                  y: historyData.data.temperature.y,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "blue" },
                },
              ]}
              layout={{
                title: "Temperature Trend",
                xaxis: {
                  title: { text: "Time", standoff: 20 }, // Move 'Time' label down
                  tickformat: "%I:%M %p", // Format to display time as "hh:mm AM/PM"
                  nticks: 10, // Adjust the number of ticks to make it more readable
                },
                yaxis: { title: "Temperature (°C)" },
                height: 300,
                margin: { t: 40, b: 60, l: 40, r: 40 }, // Increase bottom margin
              }}
              className={classes.plot}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1">
              <strong>Current Temperature</strong>
            </Typography>
            <Plot
              data={[
                {
                  type: "indicator",
                  mode: "gauge+number",
                  value: custom_data.temperature,
                  title: { text: "Current Temperature (°C)" },
                  gauge: {
                    axis: { range: [0, 60] },
                    steps: [
                      { range: [0, 20], color: "lightgray" },
                      { range: [20, 40], color: "gray" },
                      { range: [40, 60], color: "darkgray" },
                    ],
                    threshold: {
                      line: { color: "red", width: 4 },
                      thickness: 0.75,
                      value: custom_data.temperature,
                    },
                  },
                },
              ]}
              layout={{ width: 300, height: 300, margin: { t: 0, b: 0 } }}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1">
              <strong>Temperature Stats</strong>
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
                  <td>{temperatureStats.min}</td>
                </tr>
                <tr>
                  <td>Max</td>
                  <td>{temperatureStats.max}</td>
                </tr>
                <tr>
                  <td>Average</td>
                  <td>{temperatureStats.average.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Median</td>
                  <td>{temperatureStats.median}</td>
                </tr>
                <tr>
                  <td>Std Dev</td>
                  <td>{temperatureStats.stdDev.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>

        {/* Humidity Section */}
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <Typography variant="subtitle1">
              <strong>{`${label} - Humidity Trend (%)`}</strong>
            </Typography>
            <Plot
              data={[
                {
                  x: historyData.data.humidity.x,
                  y: historyData.data.humidity.y,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "green" },
                },
              ]}
              layout={{
                title: "Humidity Trend",
                xaxis: {
                  title: { text: "Time", standoff: 20 }, // Move 'Time' label down
                  tickformat: "%I:%M %p", // Format to display time as "hh:mm AM/PM"
                  nticks: 10, // Adjust the number of ticks to make it more readable
                },
                yaxis: { title: "Humidity (%)" },
                height: 300,
                margin: { t: 40, b: 60, l: 40, r: 40 }, // Increase bottom margin
              }}
              className={classes.plot}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1">
              <strong>Current Humidity</strong>
            </Typography>
            <Plot
              data={[
                {
                  type: "indicator",
                  mode: "gauge+number",
                  value: custom_data.humidity,
                  title: { text: "Current Humidity (%)" },
                  gauge: {
                    axis: { range: [0, 100] },
                    steps: [
                      { range: [0, 33], color: "lightgray" },
                      { range: [33, 66], color: "gray" },
                      { range: [66, 100], color: "darkgray" },
                    ],
                    threshold: {
                      line: { color: "red", width: 4 },
                      thickness: 0.75,
                      value: custom_data.humidity,
                    },
                  },
                },
              ]}
              layout={{ width: 300, height: 300, margin: { t: 0, b: 0 } }}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1">
              <strong>Humidity Stats</strong>
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
                  <td>{humidityStats.min}</td>
                </tr>
                <tr>
                  <td>Max</td>
                  <td>{humidityStats.max}</td>
                </tr>
                <tr>
                  <td>Average</td>
                  <td>{humidityStats.average.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Median</td>
                  <td>{humidityStats.median}</td>
                </tr>
                <tr>
                  <td>Std Dev</td>
                  <td>{humidityStats.stdDev.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>

        {/* CO2 Section */}
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <Typography variant="subtitle1">
              <strong>{`${label} - CO2 Trend (ppm)`}</strong>
            </Typography>
            <Plot
              data={[
                {
                  x: historyData.data.co2.x,
                  y: historyData.data.co2.y,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "red" },
                },
              ]}
              layout={{
                title: "CO2 Trend",
                xaxis: {
                  title: { text: "Time", standoff: 20 }, // Move 'Time' label down
                  tickformat: "%I:%M %p", // Format to display time as "hh:mm AM/PM"
                  nticks: 10, // Adjust the number of ticks to make it more readable
                },
                yaxis: { title: "CO2 (ppm)" },
                height: 300,
                margin: { t: 40, b: 60, l: 40, r: 40 }, // Increase bottom margin
              }}
              className={classes.plot}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1">
              <strong>Current CO2</strong>
            </Typography>
            <Plot
              data={[
                {
                  type: "indicator",
                  mode: "gauge+number",
                  value: custom_data.co2,
                  title: { text: "Current CO2 (ppm)" },
                  gauge: {
                    axis: { range: [0, 2000] },
                    steps: [
                      { range: [0, 600], color: "lightgray" },
                      { range: [600, 1200], color: "gray" },
                      { range: [1200, 2000], color: "darkgray" },
                    ],
                    threshold: {
                      line: { color: "red", width: 4 },
                      thickness: 0.75,
                      value: custom_data.co2,
                    },
                  },
                },
              ]}
              layout={{ width: 300, height: 300, margin: { t: 0, b: 0 } }}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1">
              <strong>CO2 Stats</strong>
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
                  <td>{co2Stats.min}</td>
                </tr>
                <tr>
                  <td>Max</td>
                  <td>{co2Stats.max}</td>
                </tr>
                <tr>
                  <td>Average</td>
                  <td>{co2Stats.average.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Median</td>
                  <td>{co2Stats.median}</td>
                </tr>
                <tr>
                  <td>Std Dev</td>
                  <td>{co2Stats.stdDev.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Am103L;
