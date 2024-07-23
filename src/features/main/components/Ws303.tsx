// Ws303.tsx
// @ts-nocheck
import React from "react";
import { Card, Grid, Typography, makeStyles, Box, Divider } from "@material-ui/core";
import Plot from "react-plotly.js";
import {
  Ws303Asset,
  useWs303HistoryQuery,
  useLiveDataForWs303,
} from "../api/ws303_history";
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
  detected: {
    color: "green",
  },
  notDetected: {
    color: "red",
  },
  statsTable: {
    marginTop: theme.spacing(1),
    '& th, & td': {
      padding: theme.spacing(0.5),
      textAlign: 'left',
    },
  },
  largeText: {
    fontSize: "1.5rem", // Increased font size for larger display
    fontWeight: "bold",
  },
  divider: {
    margin: `${theme.spacing(0.5)}px 0`,
    width: "150%", // Adjust the width to make the divider longer
  },
  verticalDivider: {
    margin: theme.spacing(0, 2), // Adjust the space between the vertical dividers
    height: "120%",
  },
  boldText: {
    fontWeight: "bold",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: "1rem", // Enlarged font size for section title
    textAlign: "center", // Center align the section title
  },
  tableRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1), // Add padding for more spacing
  },
  statLabel: {
    marginRight: theme.spacing(1), // Add space between label and value
  },
}));

const Ws303: React.FC<{ assetId: string; timeRange: RelativeOrAbsoluteRange }> = ({
  assetId,
  timeRange,
}) => {
  const classes = useStyles();

  const assetQuery = useAsset<Ws303Asset>(assetId);
  const { data: historyData } = useWs303HistoryQuery({ assetId, timeRange });
  useLiveDataForWs303({ assetId, timeRange });

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
  const leakDetectedData = historyData?.data?.leak_detected || { x: [], y: [] };

  // Calculate the number of times the leak was detected
  const timesLeaked = leakDetectedData.y.reduce((count, value, index, arr) => {
    if (index > 0 && value === 1 && arr[index - 1] === 0) {
      return count + 1;
    }
    return count;
  }, 0);

  // Calculate duration of each leak period
  const durations = [];
  let leakStartTime = null;
  leakDetectedData.y.forEach((value, index) => {
    if (value === 1 && leakStartTime === null) {
      leakStartTime = new Date(leakDetectedData.x[index]);
    } else if (value === 0 && leakStartTime !== null) {
      const leakEndTime = new Date(leakDetectedData.x[index]);
      durations.push((leakEndTime - leakStartTime) / 1000); // Duration in seconds
      leakStartTime = null;
    }
  });

  const averageDuration = durations.length > 0
    ? (durations.reduce((sum, duration) => sum + duration, 0) / durations.length).toFixed(2)
    : 0;

  return (
    <Card className={classes.card}>
      <Grid container spacing={1}>
        {/* Leak Detection Section */}
        <Grid item xs={12} className={classes.container}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography className={classes.sectionTitle} noWrap>
              {`${label} - Leak Detection Audit`}
            </Typography>
          </Box>
        </Grid>

        <Grid container item xs={12} spacing={1}>
          {/* Leak Detection Chart */}
          <Grid item xs={12} md={4} className={classes.container}>
            <Plot
              data={[
                {
                  x: leakDetectedData.x,
                  y: leakDetectedData.y,
                  type: "scatter",
                  mode: "lines+markers",
                  line: { shape: 'hv', width: 4 }, // step line and increased width
                  marker: { color: leakDetectedData.y.map((value) => (value ? "green" : "red")) },
                  hovertemplate: `<b>Date:</b> %{x|%m/%d/%y}, %{x|%I:%M %p}<br><b>Leak Detected:</b> %{customdata}<extra></extra>`,
                  customdata: leakDetectedData.y.map(value => value ? "YES" : "NO"),
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
                  ticktext: ["NO", "YES"],
                  range: [-0.1, 1.1], // Extend range to avoid cutoff
                },
                hovermode: 'x', // Hovermode 'x' for hover over x-axis
                hoverdistance: 100,
                height: 200,
                margin: { t: 40, b: 60, l: 40, r: 40 },
              }}
              className={classes.plot}
            />
          </Grid>

          {/* Vertical Divider */}
          <Divider orientation="vertical" flexItem className={classes.verticalDivider} />

          {/* Leak Detected */}
          <Grid item xs={12} md={3} className={classes.statusContainer}>
            <div>
              <Typography className={classes.sectionTitle} gutterBottom>Leak Detected</Typography>
              <Typography
                variant="body1"
                className={`${classes.largeText} ${custom_data.leak_detected ? classes.detected : classes.notDetected}`}
                align="center" // Center align the "YES"/"NO" status
              >
                {custom_data.leak_detected ? "YES" : "NO"}
              </Typography>
            </div>
          </Grid>

          {/* Vertical Divider */}
          <Divider orientation="vertical" flexItem className={classes.verticalDivider} />

          {/* Leak Stats */}
          <Grid item xs={12} md={4} className={classes.statusContainer}>
            <div>
              <Typography className={classes.sectionTitle} gutterBottom>Leak Stats</Typography>
              <div className={classes.tableRow}>
                <Typography className={classes.statLabel}>Count</Typography>
                <Typography>{timesLeaked}</Typography>
              </div>
              <Divider className={classes.divider} />
              <div className={classes.tableRow}>
                <Typography className={classes.statLabel}>Average Duration</Typography>
                <Typography>{averageDuration} sec</Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Ws303;
