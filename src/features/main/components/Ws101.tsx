// Ws101.tsx
// @ts-nocheck
import React from "react";
import { Card, Grid, Typography, makeStyles } from "@material-ui/core";
import Plot from "react-plotly.js";
import {
  Ws101Asset,
  useWs101HistoryQuery,
  useLiveDataForWs101,
} from "../api/ws101_history";
import { useAsset } from "../api/assetsQuery";
import { RelativeOrAbsoluteRange } from "../utils/types";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
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
  pushed: {
    color: "green",
  },
  notPushed: {
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

const Ws101: React.FC<{ assetId: string; timeRange: RelativeOrAbsoluteRange }> = ({
  assetId,
  timeRange,
}) => {
  const classes = useStyles();

  const assetQuery = useAsset<Ws101Asset>(assetId);

  const { data: historyData } = useWs101HistoryQuery({
    assetId: assetId,
    timeRange,
  });

  useLiveDataForWs101({
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

  // Calculate statistics for button pushed
  const buttonPushedStats = getStats(historyData.data.button_pushed.y);

  return (
    <Card>
      <Typography variant="h4">{label}</Typography>
      <Grid container spacing={1} className={classes.container}>
        {/* Button Pushed Section */}
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>{`${label} - Button Pushed Audit`}</strong></Typography>
            <Plot
              data={[
                {
                  x: historyData.data.button_pushed.x,
                  y: historyData.data.button_pushed.y,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: historyData.data.button_pushed.y.map((value) => (value ? "green" : "red")) },
                },
              ]}
              layout={{
                title: "Button Pushed Audit",
                xaxis: {
                  title: { text: "Time", standoff: 20 }, // Move 'Time' label down
                  tickformat: "%I:%M %p", // Format to display time as "hh:mm AM/PM"
                  nticks: 10, // Adjust the number of ticks to make it more readable
                },
                yaxis: { title: "Button Status" },
                height: 300,
                margin: { t: 40, b: 60, l: 40, r: 40 }, // Increase bottom margin
              }}
              className={classes.plot}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Button Pushed</strong></Typography>
            <div className={classes.statusContainer}>
              {custom_data.button_pushed ? (
                <>
                  <CheckCircleIcon className={`${classes.statusIcon} ${classes.pushed}`} />
                  <Typography variant="body1" className={classes.largeText}>
                    YES
                  </Typography>
                </>
              ) : (
                <Typography variant="body1" className={classes.largeText}>
                  NO
                </Typography>
              )}
            </div>
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Button Pushed Stats</strong></Typography>
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
                  <td>{buttonPushedStats.count}</td>
                </tr>
                <tr>
                  <td>Average Duration</td>
                  <td>{buttonPushedStats.average.toFixed(2)} sec</td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Ws101;
