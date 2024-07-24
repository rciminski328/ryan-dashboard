// Ws301.tsx
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
  Ws301Asset,
  useLiveDataForWs301,
  useWs301HistoryQuery,
} from "../api/ws301_history";

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
  statusContainerGridItem: {
    display: "flex",
    justifyContent: "center",
  },
  statusContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100%",
  },
  open: {
    color: "green",
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  closed: {
    color: "red",
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  statsTable: {
    marginTop: theme.spacing(1),
    "& th, & td": {
      padding: theme.spacing(0.5),
      textAlign: "left",
      fontSize: "1rem",
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
    height: "100%",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: "1rem",
  },
  tableRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(0.5),
  },
  statLabel: {
    marginRight: theme.spacing(1),
  },
}));

const Ws301: React.FC<{
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}> = ({ assetId, timeRange }) => {
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
  const timesOpened = doorOpenData.y.reduce<number>(
    (count, value, index, arr) => {
      if (index > 0 && value === 1 && arr[index - 1] === 0) {
        return count + 1;
      }
      return count;
    },
    0
  );

  // Calculate duration of each door open period
  const durations: number[] = [];
  let openTime: Date | null = null;
  doorOpenData.y.forEach((value, index) => {
    if (value === 1 && openTime === null) {
      openTime = new Date(doorOpenData.x[index]);
    } else if (value === 0 && openTime !== null) {
      const closeTime = new Date(doorOpenData.x[index]);
      durations.push((closeTime.getTime() - openTime.getTime()) / 1000); // Duration in seconds
      openTime = null;
    }
  });

  const averageDuration =
    durations.length > 0
      ? (
          durations.reduce((sum, duration) => sum + duration, 0) /
          durations.length
        ).toFixed(2)
      : 0;

  return (
    <Card className={classes.card}>
      {/* Door Status */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography className={classes.sectionTitle} noWrap>
          {`${label} - Door Open/Close Audit`}
        </Typography>
      </Box>

      <Grid container item xs={12} spacing={1}>
        {/* Door Status Chart */}
        <Grid item xs={12} md={6} className={classes.borderRight}>
          <Plot
            data={[
              {
                x: doorOpenData.x,
                y: doorOpenData.y,
                type: "scatter",
                mode: "lines+markers",
                line: { shape: "hv", width: 4 }, // step line and increased width
                marker: {
                  color: doorOpenData.y.map((value) =>
                    value ? "green" : "red"
                  ),
                },
                hovertemplate: `<b>Date:</b> %{x|%m/%d/%y}, %{x|%I:%M %p}<br><b>Door Status:</b> %{customdata}<extra></extra>`,
                customdata: doorOpenData.y.map((value) =>
                  value ? "OPEN" : "CLOSED"
                ),
              },
            ]}
            config={{
              responsive: true,
            }}
            layout={{
              autosize: true,
              xaxis: {
                title: { text: "Time", standoff: 20 }, // Move 'Time' label down
                tickformat: "%I:%M %p", // Format to display time as "hh:mm AM/PM"
                nticks: 10, // Adjust the number of ticks to make it more readable
              },
              yaxis: {
                tickvals: [0, 1],
                ticktext: ["NO", "YES"],
                range: [-0.1, 1.1], // Extend range to avoid cutoff
              },
              hovermode: "x", // Hovermode 'x' for hover over x-axis
              hoverdistance: 100,
              margin: { t: 40, b: 60, l: 40, r: 40 },
            }}
            style={{
              width: "100%",
              height: "100%",
              minHeight: graphChartHeight,
            }}
          />
        </Grid>

        {/* Current Door Status */}
        <Grid
          item
          xs={12}
          md={3}
          className={`${classes.statusContainerGridItem} ${classes.borderRight}`}
        >
          <div className={classes.statusContainer}>
            <Typography className={classes.sectionTitle} gutterBottom>
              Current Door Status
            </Typography>
            <Typography
              variant="body1"
              className={`${classes.largeText} ${
                custom_data.doorOpen ? classes.open : classes.closed
              }`}
              align="center" // Center align the "OPEN"/"CLOSED" status
            >
              {custom_data.doorOpen ? "OPEN" : "CLOSED"}
            </Typography>
          </div>
        </Grid>

        {/* Door Stats */}
        <Grid item xs={12} md={3} className={classes.statusContainerGridItem}>
          <div className={classes.statusContainer}>
            <Typography className={classes.sectionTitle} gutterBottom>
              Door Stats
            </Typography>
            <table className={classes.statsTable}>
              <tbody>
                <tr>
                  <td className={classes.statLabel}>Times</td>
                  <td>{timesOpened}</td>
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
    </Card>
  );
};

export default Ws301;
