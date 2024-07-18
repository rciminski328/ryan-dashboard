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
  table: {
    width: "100%",
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

  const { data: historyData } = useWs301HistoryQuery({
    assetId: assetId,
    timeRange,
  });

  useLiveDataForWs301({
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

  // Calculate statistics for door open/close
  const doorStats = getStats(historyData.data.doorOpen.y);

  return (
    <Card>
      <Typography variant="h4">{label}</Typography>
      <Grid container spacing={1} className={classes.container}>
        {/* Door Status Section */}
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>{`${label} - Door Open/Close Audit`}</strong></Typography>
            <Plot
              data={[
                {
                  x: historyData.data.doorOpen.x,
                  y: historyData.data.doorOpen.y,
                  type: "scatter",
                  mode: "lines+markers",
                  line: { shape: 'hv' }, // step line
                  marker: { color: historyData.data.doorOpen.y.map((value) => (value ? "green" : "red")) },
                },
              ]}
              layout={{
                title: "Door Open/Close Audit",
                xaxis: {
                  title: { text: "Time", standoff: 20 }, // Move 'Time' label down
                  tickformat: "%I:%M %p", // Format to display time as "hh:mm AM/PM"
                  nticks: 10, // Adjust the number of ticks to make it more readable
                },
                yaxis: { 
                  tickvals: [0, 1],
                  ticktext: ["Closed", "Open"],
                },
                height: 300,
                margin: { t: 40, b: 60, l: 40, r: 40 }, // Increase bottom margin
              }}
              className={classes.plot}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Door Status</strong></Typography>
            <div className={classes.statusContainer}>
              <Typography
                variant="body1"
                className={`${classes.largeText} ${custom_data.isOpen ? classes.open : classes.closed}`}
              >
                {custom_data.isOpen ? "OPEN" : "CLOSED"}
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
                  <td>Count</td>
                  <td>{doorStats.count}</td>
                </tr>
                <tr>
                  <td>Average Duration</td>
                  <td>{doorStats.average.toFixed(2)} sec</td>
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
