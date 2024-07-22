// Ws301.tsx
// @ts-nocheck
import React from "react";
import { Card, Grid, Typography, makeStyles } from "@material-ui/core";
import Plot from "react-plotly.js";
import {
  Ws301Asset,
  useWs301HistoryQuery,
  useLiveDataForWs301,
} from "../api/ws301_history";
import { useAsset } from "../api/assetsQuery";
import { RelativeOrAbsoluteRange } from "../utils/types";
import { getStats } from "../../../utils/getStats";

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
  statusContainer: {
    display: "flex",
    alignItems: "center",
  },
  statusIcon: {
    marginRight: theme.spacing(1),
  },
  open: {
    color: "green",
  },
  closed: {
    color: "red",
  },
  label: {
    marginBottom: theme.spacing(2),
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

const Ws301: React.FC<{ assetId: string; timeRange: RelativeOrAbsoluteRange }> = ({
  assetId,
  timeRange,
}) => {
  const classes = useStyles();

  const assetQuery = useAsset<Ws301Asset>(assetId);
  const { data: historyData } = useWs301HistoryQuery({ assetId, timeRange });
  useLiveDataForWs301({ assetId, timeRange });

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
  const doorOpenData = historyData?.data?.doorOpen || { x: [], y: [] };

  // Calculate the number of times the door was opened
  const timesOpened = doorOpenData.y.reduce((count, value, index, arr) => {
    if (index > 0 && value === 1 && arr[index - 1] === 0) {
      return count + 1;
    }
    return count;
  }, 0);

  // Calculate duration of each door open period
  const durations = [];
  let openTime = null;
  doorOpenData.y.forEach((value, index) => {
    if (value === 1 && openTime === null) {
      openTime = new Date(doorOpenData.x[index]);
    } else if (value === 0 && openTime !== null) {
      const closeTime = new Date(doorOpenData.x[index]);
      durations.push((closeTime - openTime) / 1000); // Duration in seconds
      openTime = null;
    }
  });

  const averageDuration = durations.length > 0
    ? (durations.reduce((sum, duration) => sum + duration, 0) / durations.length).toFixed(2)
    : 0;

  return (
    <Card>
      <Grid container spacing={1} className={classes.container}>
        {/* Door Status Section */}
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>{`${label} - Door Open/Close Audit`}</strong></Typography>
            <Plot
              data={[
                {
                  x: doorOpenData.x,
                  y: doorOpenData.y,
                  type: "scatter",
                  mode: "lines+markers",
                  line: { shape: 'hv' }, // step line
                  marker: { color: doorOpenData.y.map((value) => (value ? "green" : "red")) },
                  hovertemplate: `<b>Date:</b> %{x|%m/%d/%y}, %{x|%I:%M %p}<br><b>Door Open:</b> %{y}<extra></extra>`,
                },
              ]}
              layout={{
                xaxis: {
                  title: { text: "Time", standoff: 20 }, // Move 'Time' label down
                  tickformat: "%I:%M %p", // Format to display time as "hh:mm AM/PM"
                  nticks: 10, // Adjust the number of ticks to make it more readable
                },
                yaxis: { 
                  tickvals: [0, 1],
                  range: [0, 1],
                },
                height: 300,
                margin: { t: 40, b: 60, l: 40, r: 40 },
              }}
              className={classes.plot}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Door Status</strong></Typography>
            <div className={classes.statusContainer}>
              <Typography
                variant="body1"
                className={`${classes.largeText} ${custom_data.doorOpen ? classes.open : classes.closed}`}
              >
                {custom_data.doorOpen ? "OPEN" : "CLOSED"}
              </Typography>
            </div>
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Door Stats</strong></Typography>
            <table className={classes.statsTable}>
              <thead>
                <tr>
                  <th>Statistic</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Times Opened</td>
                  <td>{timesOpened}</td>
                </tr>
                <tr>
                  <td>Average Duration</td>
                  <td>{averageDuration}</td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Ws301;
