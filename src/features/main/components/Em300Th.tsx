// Em300Th.tsx
// @ts-nocheck
import { Card, Grid, Typography, makeStyles } from "@material-ui/core";
import React from "react";
import Plot from "react-plotly.js";
import {
  Em300ThAsset,
  useEm300ThHistoryQuery,
  useLiveDataForEm300Th,
} from "../api/em300_th_history";
import { useAsset } from "../api/assetsQuery";
import { RelativeOrAbsoluteRange } from "../utils/types";
import { getStats } from "../../../utils/getStats"; // import the existing utility function

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
    height: 300, // Adjusted height of the plot
  },
  label: {
    marginBottom: theme.spacing(2),
  },
  statsTable: {
    marginTop: theme.spacing(2),
    '& th, & td': {
      padding: theme.spacing(1),
    },
    fontSize: "1.2rem", // Increase font size for better visibility
  },
  largeText: {
    fontSize: "1.5rem", // Larger text for better visibility
  },
}));

const Em300Th: React.FC<{ assetId: string; timeRange: RelativeOrAbsoluteRange }> = ({
  assetId,
  timeRange,
}) => {
  const classes = useStyles();

  const assetQuery = useAsset<Em300ThAsset>(assetId);

  const { data: historyData } = useEm300ThHistoryQuery({
    assetId: assetId,
    timeRange,
  });

  useLiveDataForEm300Th({
    assetId: assetId,
    timeRange,
  });

  if (assetQuery.isLoading || !historyData) {
    return <div>Loading...</div>;
  }

  if (assetQuery.isError) {
    return <div>Error loading data</div>;
  }

  const custom_data = assetQuery.data.custom_data;
  const label = assetQuery.data.label;

  // Calculate statistics for temperature and humidity
  const temperatureStats = getStats(historyData.data.temperature.y);
  const humidityStats = getStats(historyData.data.humidity.y);

  return (
    <Card>
      <Grid container spacing={1} className={classes.container}>
        {/* Temperature Section */}
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>{`${label} - Temperature Trend (°F)`}</strong></Typography>
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
                xaxis: {
                  title: { text: "Time", standoff: 20 }, // Move 'Time' label down
                  tickformat: "%I:%M %p", // Format to display time as "hh:mm AM/PM"
                  nticks: 10, // Adjust the number of ticks to make it more readable
                },
                height: 300, // Adjust height to reduce whitespace
                margin: { t: 40, b: 60, l: 40, r: 40 }, // Adjust margins to reduce whitespace
              }}
              className={classes.plot}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Current Temperature</strong></Typography>
            <Plot
              data={[
                {
                  type: "indicator",
                  mode: "gauge+number",
                  value: custom_data.temperature,
                  gauge: {
                    axis: { range: [-10, 120] },
                    steps: [
                      { range: [-10, 20], color: "lightgray" },
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
              layout={{ width: 250, height: 250, margin: { t: 0, b: 0 } }}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Temperature Stats</strong></Typography>
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
                  <td>{temperatureStats.min.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Max</td>
                  <td>{temperatureStats.max.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Average</td>
                  <td>{temperatureStats.average.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Median</td>
                  <td>{temperatureStats.median.toFixed(2)}</td>
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
            <Typography variant="subtitle1"><strong>{`${label} - Humidity Trend (%)`}</strong></Typography>
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
                xaxis: {
                  title: { text: "Time", standoff: 20 }, // Move 'Time' label down
                  tickformat: "%I:%M %p", // Format to display time as "hh:mm AM/PM"
                  nticks: 10, // Adjust the number of ticks to make it more readable
                },
                height: 300, // Adjust height to reduce whitespace
                margin: { t: 40, b: 60, l: 40, r: 40 }, // Adjust margins to reduce whitespace
              }}
              className={classes.plot}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Current Humidity</strong></Typography>
            <Plot
              data={[
                {
                  type: "indicator",
                  mode: "gauge+number",
                  value: custom_data.humidity,
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
              layout={{ width: 250, height: 250, margin: { t: 0, b: 0 } }}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Humidity Stats</strong></Typography>
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
                  <td>{humidityStats.min.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Max</td>
                  <td>{humidityStats.max.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Average</td>
                  <td>{humidityStats.average.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Median</td>
                  <td>{humidityStats.median.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Std Dev</td>
                  <td>{humidityStats.stdDev.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Em300Th;
