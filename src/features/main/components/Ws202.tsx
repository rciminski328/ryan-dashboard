// Ws202.tsx
import {
  Box,
  Card,
  Divider,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import Plot from "react-plotly.js";
import { graphChartHeight } from "../../../utils";
import { RelativeOrAbsoluteRange } from "../../../utils/types";
import { useAsset } from "../api/assetsQuery";
import {
  Ws202Asset,
  useLiveDataForWs202,
  useWs202HistoryQuery,
} from "../api/ws202_history";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontFamily: "Arial, sans-serif",
  },
  borderRight: {
    [theme.breakpoints.up("md")]: {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
  },
  statusContainer: {
    display: "flex",
    justifyContent: "center",
  },
  detected: {
    color: "red",
  },
  notDetected: {
    color: "green",
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

  const motionData = historyData.data.motion;
  const daylightData = historyData.data.daylight;

  // Calculate statistics for motion and daylight
  const motionStats = historyData.stats.motion;
  const daylightStats = historyData.stats.daylight;

  return (
    <Card className={classes.card}>
      {/* Motion Detection Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography className={classes.sectionTitle} noWrap>
          {`${label} - Motion Detection Audit`}
        </Typography>
      </Box>

      <Grid container item xs={12} spacing={1}>
        {/* Motion Detection Chart */}
        <Grid item xs={12} md={6} className={classes.borderRight}>
          <Plot
            data={[
              {
                x: motionData.x,
                y: motionData.y,
                type: "scatter",
                mode: "lines+markers",
                line: { shape: "hv", width: 4 }, // smooth line and increased width
                marker: {
                  color: motionData.y.map((value) => (value ? "green" : "red")),
                },
                hoverinfo: "x+y", // Show x and y information on hover
                hovertemplate: `<b>Date:</b> %{x|%m/%d/%y}, %{x|%I:%M %p}<br><b>Motion Detected:</b> %{customdata}<extra></extra>`,
                customdata: motionData.y.map((value) => (value ? "YES" : "NO")),
              },
            ]}
            config={{
              responsive: true,
            }}
            layout={{
              autosize: true,
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
              margin: { t: 40, b: 60, l: 40, r: 40 },
            }}
            style={{
              width: "100%",
              height: "100%",
              minHeight: graphChartHeight,
            }}
          />
        </Grid>

        {/* Motion Detected */}
        <Grid
          item
          xs={12}
          md={3}
          className={`${classes.statusContainer} ${classes.borderRight}`}
        >
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

        {/* Motion Stats */}
        <Grid item xs={12} md={3} className={classes.statusContainer}>
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
              <Typography>{isNaN(motionStats.average) ? 0 : motionStats.average.toFixed(2)} sec</Typography>
            </div>
          </div>
        </Grid>
      </Grid>

      {/* Horizontal Divider */}
      <Grid item xs={12}>
        <Box pt={0.5}>
          <Divider className={classes.divider} />
        </Box>
      </Grid>

      {/* Daylight Detection Section */}
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography className={classes.sectionTitle} noWrap>
            {`${label} - Light Status Audit`}
          </Typography>
        </Box>
      </Grid>

      <Grid container item xs={12} spacing={1}>
        {/* Daylight Detection Chart */}
        <Grid item xs={12} md={6} className={classes.borderRight}>
          <Plot
            data={[
              {
                x: daylightData.x,
                y: daylightData.y,
                type: "scatter",
                mode: "lines+markers",
                line: { shape: "hv", width: 4 }, // smooth line and increased width
                marker: {
                  color: daylightData.y.map((value) =>
                    value ? "yellow" : "gray"
                  ),
                },
                hoverinfo: "x+y", // Show x and y information on hover
                hovertemplate: `<b>Date:</b> %{x|%m/%d/%y}, %{x|%I:%M %p}<br><b>Light Status:</b> %{customdata}<extra></extra>`,
                customdata: daylightData.y.map((value) =>
                  value ? "ON" : "OFF"
                ),
              },
            ]}
            config={{
              responsive: true,
            }}
            layout={{
              xaxis: {
                title: { text: "Time", standoff: 20 },
                tickformat: "%I:%M %p",
                nticks: 10,
              },
              yaxis: {
                tickvals: [0, 1],
                ticktext: ["OFF", "ON"], // Display YES/NO instead of 0/1
                range: [-0.1, 1.1], // Extend range to avoid cutoff
              },
              hovermode: "x", // Show hover tool on the x-axis
              hoverdistance: 100, // Increase hover distance
              margin: { t: 40, b: 60, l: 40, r: 40 },
            }}
            style={{
              width: "100%",
              height: "100%",
              minHeight: graphChartHeight,
            }}
          />
        </Grid>

        {/* Daylight Detected */}
        <Grid
          item
          xs={12}
          md={3}
          className={`${classes.statusContainer} ${classes.borderRight}`}
        >
          <div>
            <Typography className={classes.sectionTitle} gutterBottom>
              Light Status
            </Typography>
            <Typography
              variant="body1"
              className={`${classes.largeText} ${
                custom_data.daylight ? classes.detected : classes.notDetected
              }`}
              align="center" // Center align the "YES"/"NO" status
            >
              {custom_data.daylight ? "ON" : "OFF"}
            </Typography>
          </div>
        </Grid>

        {/* Daylight Stats */}
        <Grid item xs={12} md={3} className={classes.statusContainer}>
          <div>
            <Typography className={classes.sectionTitle} gutterBottom>
              Light Stats
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
              <Typography>{isNaN(daylightStats.average) ? 0 : daylightStats.average.toFixed(2)} sec</Typography>
            </div>
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Ws202;
