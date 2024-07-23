// Ws202.tsx
// @ts-nocheck
import React from "react";
import {
  Card,
  Grid,
  Typography,
  makeStyles,
  Box,
  Divider,
} from "@material-ui/core";
import Plot from "react-plotly.js";
import {
  Ws202Asset,
  useWs202HistoryQuery,
  useLiveDataForWs202,
} from "../api/ws202_history";
import { useAsset } from "../api/assetsQuery";
import { getStats } from "../../../utils/getStats";
import { RelativeOrAbsoluteRange } from "../../refrigeratorStatus/utils/types";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontFamily: "Arial, sans-serif",
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
    "& th, & td": {
      padding: theme.spacing(0.5),
      textAlign: "left",
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1), // Add padding for more spacing
  },
  statLabel: {
    marginRight: theme.spacing(1), // Add space between label and value
  },
}));

const Ws202: React.FC<{
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}> = ({ assetId, timeRange }) => {
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

  // Map 1 and 2 to 0 and 1 for display purposes
  const mappedMotionData = motionData.y.map((value) => (value === 2 ? 1 : 0));

  // Calculate statistics for motion and daylight
  const motionStats = getStats(mappedMotionData);
  const daylightStats = getStats(daylightData.y);

  return (
    <Card className={classes.card}>
      <Grid container spacing={1}>
        {/* Motion Detection Section */}
        <Grid item xs={12} className={classes.container}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography className={classes.sectionTitle} noWrap>
              {`${label} - Motion Detection Audit`}
            </Typography>
          </Box>
        </Grid>

        <Grid container item xs={12} spacing={1}>
          {/* Motion Detection Chart */}
          <Grid item xs={12} md={4} className={classes.container}>
            <Plot
              data={[
                {
                  x: motionData.x,
                  y: mappedMotionData,
                  type: "scatter",
                  mode: "lines+markers",
                  line: { shape: "spline", width: 4 }, // smooth line and increased width
                  marker: {
                    color: mappedMotionData.map((value) =>
                      value ? "green" : "red"
                    ),
                  },
                  hoverinfo: "x+y", // Show x and y information on hover
                  hovertemplate: `<b>Date:</b> %{x|%m/%d/%y}, %{x|%I:%M %p}<br><b>Motion Detected:</b> %{customdata}<extra></extra>`,
                  customdata: mappedMotionData.map((value) =>
                    value ? "YES" : "NO"
                  ),
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
                  ticktext: ["NO", "YES"], // Display YES/NO instead of 0/1
                  range: [-0.1, 1.1], // Extend range to avoid cutoff
                },
                hovermode: "x", // Show hover tool on the x-axis
                hoverdistance: 100, // Increase hover distance
                height: 200,
                margin: { t: 40, b: 60, l: 40, r: 40 },
              }}
              className={classes.plot}
            />
          </Grid>

          {/* Vertical Divider */}
          <Divider
            orientation="vertical"
            flexItem
            className={classes.verticalDivider}
          />

          {/* Motion Detected */}
          <Grid item xs={12} md={3} className={classes.statusContainer}>
            <div>
              <Typography className={classes.sectionTitle} gutterBottom>
                Motion Detected
              </Typography>
              <Typography
                variant="body1"
                className={`${classes.largeText} ${
                  custom_data.motion ? classes.detected : classes.notDetected
                }`}
                align="center" // Center align the "YES"/"NO" status
              >
                {custom_data.motion ? "YES" : "NO"}
              </Typography>
            </div>
          </Grid>

          {/* Vertical Divider */}
          <Divider
            orientation="vertical"
            flexItem
            className={classes.verticalDivider}
          />

          {/* Motion Stats */}
          <Grid item xs={12} md={4} className={classes.statusContainer}>
            <div>
              <Typography className={classes.sectionTitle} gutterBottom>
                Motion Stats
              </Typography>
              <div className={classes.tableRow}>
                <Typography className={classes.statLabel}>Count</Typography>
                <Typography>{motionData.count}</Typography>
              </div>
              <Divider className={classes.divider} />
              <div className={classes.tableRow}>
                <Typography className={classes.statLabel}>
                  Average Duration
                </Typography>
                <Typography>{motionStats.average.toFixed(2)} sec</Typography>
              </div>
            </div>
          </Grid>
        </Grid>

        {/* Horizontal Divider */}
        <Grid item xs={12}>
          <Divider className={classes.divider} />
        </Grid>

        {/* Daylight Detection Section */}
        <Grid item xs={12} className={classes.container}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography className={classes.sectionTitle} noWrap>
              {`${label} - Daylight Detection Audit`}
            </Typography>
          </Box>
        </Grid>

        <Grid container item xs={12} spacing={1}>
          {/* Daylight Detection Chart */}
          <Grid item xs={12} md={4} className={classes.container}>
            <Plot
              data={[
                {
                  x: daylightData.x,
                  y: daylightData.y,
                  type: "scatter",
                  mode: "lines+markers",
                  line: { shape: "spline", width: 4 }, // smooth line and increased width
                  marker: {
                    color: daylightData.y.map((value) =>
                      value ? "yellow" : "gray"
                    ),
                  },
                  hoverinfo: "x+y", // Show x and y information on hover
                  hovertemplate: `<b>Date:</b> %{x|%m/%d/%y}, %{x|%I:%M %p}<br><b>Daylight Detected:</b> %{customdata}<extra></extra>`,
                  customdata: daylightData.y.map((value) =>
                    value ? "YES" : "NO"
                  ),
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
                  ticktext: ["NO", "YES"], // Display YES/NO instead of 0/1
                  range: [-0.1, 1.1], // Extend range to avoid cutoff
                },
                hovermode: "x", // Show hover tool on the x-axis
                hoverdistance: 100, // Increase hover distance
                height: 200,
                margin: { t: 40, b: 60, l: 40, r: 40 },
              }}
              className={classes.plot}
            />
          </Grid>

          {/* Vertical Divider */}
          <Divider
            orientation="vertical"
            flexItem
            className={classes.verticalDivider}
          />

          {/* Daylight Detected */}
          <Grid item xs={12} md={3} className={classes.statusContainer}>
            <div>
              <Typography className={classes.sectionTitle} gutterBottom>
                Daylight Detected
              </Typography>
              <Typography
                variant="body1"
                className={`${classes.largeText} ${
                  custom_data.daylight ? classes.detected : classes.notDetected
                }`}
                align="center" // Center align the "YES"/"NO" status
              >
                {custom_data.daylight ? "YES" : "NO"}
              </Typography>
            </div>
          </Grid>

          {/* Vertical Divider */}
          <Divider
            orientation="vertical"
            flexItem
            className={classes.verticalDivider}
          />

          {/* Daylight Stats */}
          <Grid item xs={12} md={4} className={classes.statusContainer}>
            <div>
              <Typography className={classes.sectionTitle} gutterBottom>
                Daylight Stats
              </Typography>
              <div className={classes.tableRow}>
                <Typography className={classes.statLabel}>Count</Typography>
                <Typography>{daylightData.count}</Typography>
              </div>
              <Divider className={classes.divider} />
              <div className={classes.tableRow}>
                <Typography className={classes.statLabel}>
                  Average Duration
                </Typography>
                <Typography>{daylightStats.average.toFixed(2)} sec</Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Ws202;
