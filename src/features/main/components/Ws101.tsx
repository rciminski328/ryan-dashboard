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
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { getStats } from "../../../utils/getStats";
import { RelativeOrAbsoluteRange } from "../utils/types";

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
  const { data: historyData } = useWs101HistoryQuery({ assetId, timeRange });
  useLiveDataForWs101({ assetId, timeRange });

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

  // Calculate count of button pushes
  const buttonPushedCount = historyData.data.button_pushed.y.filter(
    (value) => value === 1
  ).length;

  // Convert 1 to "true" and 0 to "false" for hover information
  const buttonPushedData = historyData.data.button_pushed.y.map(val => val ? "true" : "false");

  return (
    <Card>
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
                  line: { shape: "hv" }, // step line
                  marker: { color: historyData.data.button_pushed.y.map((value) => (value ? "green" : "red")) },
                  hovertemplate: `<b>Date:</b> %{x|%m/%d/%y}, %{x|%I:%M %p}<br><b>Button Pushed:</b> %{y}<extra></extra>`,
                },
              ]}
              layout={{
                xaxis: {
                  title: { text: "Time", standoff: 20 },
                  tickformat: "%I:%M %p",
                  nticks: 10,
                },
                yaxis: { 
                  title: "Button Pushed",
                  tickvals: [0, 1],
                  ticktext: ["false", "true"],
                  range: [0, 1],
                },
                height: 300,
                margin: { t: 40, b: 60, l: 40, r: 40 },
              }}
              className={classes.plot}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Button Pushed</strong></Typography>
            <div className={classes.statusContainer}>
              <Typography
                variant="body1"
                className={`${classes.largeText} ${custom_data.button_pushed ? classes.pushed : classes.notPushed}`}
              >
                {custom_data.button_pushed ? "YES" : "NO"}
              </Typography>
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
                  <td>{buttonPushedCount}</td>
                </tr>
                <tr>
                  <td>Times Pushed</td>
                  <td>{buttonPushedCount}</td>
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
