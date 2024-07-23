// Ws101.tsx
// @ts-nocheck
import React from "react";
import { Card, Grid, Typography, makeStyles, Box, Divider } from "@material-ui/core";
import Plot from "react-plotly.js";
import {
  Ws101Asset,
  useWs101HistoryQuery,
  useLiveDataForWs101,
} from "../api/ws101_history";
import { useAsset } from "../api/assetsQuery";
import { RelativeOrAbsoluteRange } from "../utils/types";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontFamily: 'Arial, sans-serif',
  },
  container: {
    width: "100%",
  },
  plot: {
    width: "100%",
    height: 200,
  },
  statusContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100%",
  },
  pushed: {
    color: "green",
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  notPushed: {
    color: "red",
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  statsTable: {
    marginTop: theme.spacing(1),
    '& th, & td': {
      padding: theme.spacing(0.5),
      textAlign: 'left',
      fontSize: '1rem',
    },
  },
  largeText: {
    fontSize: "1.5rem", // Matched font size
    fontWeight: "bold",
  },
  divider: {
    margin: `${theme.spacing(0.5)}px 0`,
    width: "100%", // Adjust the width to make the divider longer
  },
  verticalDivider: {
    margin: theme.spacing(0, 2), // Adjust the space between the vertical dividers
    height: "120%",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: "1rem",
  },
  tableRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0.5),
  },
  statLabel: {
    marginRight: theme.spacing(1),
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

  // Calculate duration of each button push period
  const durations = [];
  let pushStartTime = null;
  historyData.data.button_pushed.y.forEach((value, index) => {
    if (value === 1 && pushStartTime === null) {
      pushStartTime = new Date(historyData.data.button_pushed.x[index]);
    } else if (value === 0 && pushStartTime !== null) {
      const pushEndTime = new Date(historyData.data.button_pushed.x[index]);
      durations.push((pushEndTime - pushStartTime) / 1000); // Duration in seconds
      pushStartTime = null;
    }
  });

  const averageDuration = durations.length > 0
    ? (durations.reduce((sum, duration) => sum + duration, 0) / durations.length).toFixed(2)
    : 0;

  return (
    <Card className={classes.card}>
      <Grid container spacing={1}>
        {/* Button Pushed Section */}
        <Grid item xs={12} className={classes.container}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography className={classes.sectionTitle} noWrap>
              {`${label} - Button Pushed Audit`}
            </Typography>
          </Box>
        </Grid>

        <Grid container item xs={12} spacing={1}>
          {/* Button Pushed Chart */}
          <Grid item xs={12} md={4} className={classes.container}>
            <Plot
              data={[
                {
                  x: historyData.data.button_pushed.x,
                  y: historyData.data.button_pushed.y,
                  type: "scatter",
                  mode: "lines+markers",
                  line: { shape: "hv", width: 4 }, // step line and increased width
                  marker: { color: historyData.data.button_pushed.y.map((value) => (value ? "green" : "red")) },
                  hovertemplate: `<b>Date:</b> %{x|%m/%d/%y}, %{x|%I:%M %p}<br><b>Button Pushed:</b> %{customdata}<extra></extra>`,
                  customdata: historyData.data.button_pushed.y.map(value => value ? "YES" : "NO"),
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
                  range: [-0.1, 1.1], // Extend range to avoid cutoff
                },
                hovermode: 'closest',
                height: 200,
                margin: { t: 40, b: 60, l: 40, r: 40 },
              }}
              className={classes.plot}
            />
          </Grid>

          {/* Vertical Divider */}
          <Divider orientation="vertical" flexItem className={classes.verticalDivider} />

          {/* Button Pushed */}
          <Grid item xs={12} md={3} className={classes.statusContainer}>
            <div>
              <Typography className={classes.sectionTitle} gutterBottom>Button Pushed</Typography>
              <Typography
                variant="body1"
                className={`${classes.largeText} ${custom_data.button_pushed ? classes.pushed : classes.notPushed}`}
                align="center" // Center align the "YES"/"NO" status
              >
                {custom_data.button_pushed ? "YES" : "NO"}
              </Typography>
            </div>
          </Grid>

          {/* Vertical Divider */}
          <Divider orientation="vertical" flexItem className={classes.verticalDivider} />

          {/* Button Pushed Stats */}
          <Grid item xs={12} md={4} className={classes.statusContainer}>
            <div>
              <Typography className={classes.sectionTitle} gutterBottom>Button Pushed Stats</Typography>
              <table className={classes.statsTable}>
                <tbody>
                  <tr>
                    <td className={classes.statLabel}>Count</td>
                    <td>{buttonPushedCount}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <Divider className={classes.divider} />
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.statLabel}>Average Duration</td>
                    <td>{averageDuration}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Ws101;
