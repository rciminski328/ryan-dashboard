// Ws202.tsx
// @ts-nocheck
import React from "react";
import { Card, Grid, Typography, makeStyles } from "@material-ui/core";
import Plot from "react-plotly.js";
import {
  Ws202Asset,
  useWs202HistoryQuery,
  useLiveDataForWs202,
} from "../api/ws202_history";
import { useAsset } from "../api/assetsQuery";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { getStats } from "../../../utils/getStats";
import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
  },
  section: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  plot: {
    width: "100%",
    height: 300,
  },
  label: {
    marginBottom: theme.spacing(2),
  },
  statusContainer: {
    display: "flex",
    alignItems: "center",
  },
  statusIcon: {
    marginRight: theme.spacing(1),
  },
  detected: {
    color: "green",
  },
  notDetected: {
    color: "red",
  },
  statsTable: {
    marginTop: theme.spacing(2),
    '& th, & td': {
      padding: theme.spacing(1),
    },
  },
  largeText: {
    fontSize: "2rem",
    fontWeight: "bold",
  },
}));

const Ws202: React.FC<{ assetId: string; timeRange: RelativeOrAbsoluteRange }> = ({
  assetId,
  timeRange,
}) => {
  const classes = useStyles();

  const assetQuery = useAsset<Ws202Asset>(assetId);
  const { data: historyData } = useWs202HistoryQuery({ assetId, timeRange });
  useLiveDataForWs202({ assetId, timeRange });

  // Handle loading and error states
  if (assetQuery.isLoading || !historyData) {
    return <div>Loading...</div>;
  }

  if (assetQuery.isError) {
    return <div>Error loading data</div>;
  }

  // Ensure assetQuery.data is defined before accessing its properties
  const assetData = assetQuery.data;
  if (!assetData) {
    return <div>No asset data available</div>;
  }

  const custom_data = assetData.custom_data;
  const label = assetData.label;

  // Ensure historyData and its properties are defined before accessing them
  const motionData = historyData?.motion || { x: [], y: [], count: 0 };
  const daylightData = historyData?.daylight || { x: [], y: [], count: 0 };

  // Calculate statistics for motion and daylight
  const motionStats = getStats(motionData.y);
  const daylightStats = getStats(daylightData.y);

  return (
    <Card>
      <Grid container spacing={1} className={classes.container}>
        {/* Motion Detection Section */}
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>{`${label} - Motion Detection Audit`}</strong></Typography>
            <Plot
              data={[
                {
                  x: motionData.x,
                  y: motionData.y,
                  type: "scatter",
                  mode: "lines+markers",
                  line: { shape: 'hv' }, // step line
                  marker: { color: motionData.y.map((value) => (value === 2 ? "green" : "red")) },
                  hovertemplate: `<b>Date:</b> %{x|%m/%d/%y}, %{x|%I:%M %p}<br><b>Motion Detected:</b> %{y}<extra></extra>`,
                },
              ]}
              layout={{
                xaxis: {
                  title: { text: "Time", standoff: 20 },
                  tickformat: "%I:%M %p",
                  nticks: 10,
                },
                yaxis: { 
                  tickvals: [1, 2],
                  range: [1, 2],
                },
                height: 300,
                margin: { t: 0, b: 60, l: 40, r: 40 },
              }}
              className={classes.plot}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Motion Detected</strong></Typography>
            <div className={classes.statusContainer}>
              <Typography
                variant="body1"
                className={`${classes.largeText} ${custom_data.motion ? classes.detected : classes.notDetected}`}
              >
                {custom_data.motion ? "YES" : "NO"}
              </Typography>
            </div>
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Motion Stats</strong></Typography>
            <table className={classes.statsTable}>
              <thead>
                <tr>
                  <th>Statistic</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Count</td>
                  <td>{motionData.count}</td>
                </tr>
                <tr>
                  <td>Average Duration</td>
                  <td>{motionStats.average.toFixed(2)} sec</td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>

        {/* Daylight Detection Section */}
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>{`${label} - Daylight Detection Audit`}</strong></Typography>
            <Plot
              data={[
                {
                  x: daylightData.x,
                  y: daylightData.y,
                  type: "scatter",
                  mode: "lines+markers",
                  line: { shape: 'hv' },
                  marker: { color: daylightData.y.map((value) => (value ? "yellow" : "gray")) },
                  hovertemplate: `<b>Date:</b> %{x|%m/%d/%y}, %{x|%I:%M %p}<br><b>Daylight Detected:</b> %{y}<extra></extra>`,
                },
              ]}
              layout={{
                xaxis: {
                  title: { text: "Time", standoff: 20 },
                  tickformat: "%I:%M %p",
                  nticks: 10,
                },
                yaxis: { 
                  tickvals: [0, 1],
                  range: [0, 1],
                },
                height: 300,
                margin: { t: 0, b: 60, l: 40, r: 40 },
              }}
              className={classes.plot}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Daylight Detected</strong></Typography>
            <div className={classes.statusContainer}>
              <Typography
                variant="body1"
                className={`${classes.largeText} ${custom_data.daylight ? classes.detected : classes.notDetected}`}
              >
                {custom_data.daylight ? "YES" : "NO"}
              </Typography>
            </div>
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Daylight Stats</strong></Typography>
            <table className={classes.statsTable}>
              <thead>
                <tr>
                  <th>Statistic</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Count</td>
                  <td>{daylightData.count}</td>
                </tr>
                <tr>
                  <td>Average Duration</td>
                  <td>{daylightStats.average.toFixed(2)} sec</td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Ws202;
