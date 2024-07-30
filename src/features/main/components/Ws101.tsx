// Ws101.tsx
import { Box, Card, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import Plot from "react-plotly.js";
import { graphChartHeight } from "../../../utils";
import { RelativeOrAbsoluteRange } from "../../../utils/types";
import { useAsset } from "../api/assetsQuery";
import {
  useLiveDataForWs101,
  useWs101HistoryQuery,
  Ws101Asset,
} from "../api/ws101_history";

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
  pushed: {
    color: "red",
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  notPushed: {
    color: "green",
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
    margin: theme.spacing(0, 2),
    height: "200px", // Set a fixed height
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
  tableRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1),
  },
  statLabel: {
    marginRight: theme.spacing(1),
  },
}));

const Ws101: React.FC<{
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}> = ({ assetId, timeRange }) => {
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

  return (
    <Card className={classes.card}>
      {/* Button Pushed Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography className={classes.sectionTitle} noWrap>
          {`${label} - Button Pushed Audit`}
        </Typography>
      </Box>

      <Grid container item xs={12} spacing={1}>
        {/* Button Pushed Chart */}
        <Grid item xs={12} md={6} className={classes.borderRight}>
          <Plot
            data={[
              {
                x: historyData.data.button_pushed.x,
                y: historyData.data.button_pushed.y,
                type: "scatter",
                mode: "lines+markers",
                line: { shape: "hv", width: 4 }, // step line and increased width
                marker: {
                  color: historyData.data.button_pushed.y.map((value) =>
                    value ? "green" : "red"
                  ),
                },
                hovertemplate: `<b>Date:</b> %{x|%m/%d/%y}, %{x|%I:%M %p}<br><b>Button Pushed:</b> %{customdata}<extra></extra>`,
                customdata: historyData.data.button_pushed.y.map((value) =>
                  value ? "YES" : "NO"
                ),
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

        {/* Button Pushed */}
        <Grid
          item
          xs={12}
          md={3}
          className={`${classes.statusContainer} ${classes.borderRight}`}
        >
          <div>
            <Typography className={classes.sectionTitle} gutterBottom>
              Button Pushed
            </Typography>
            <Typography
              variant="body1"
              className={`${classes.largeText} ${
                custom_data.button_pushed ? classes.pushed : classes.notPushed
              }`}
              align="center" // Center align the "YES"/"NO" status
            >
              {custom_data.button_pushed ? "YES" : "NO"}
            </Typography>
          </div>
        </Grid>

        {/* Button Pushed Stats */}
        <Grid item xs={12} md={3} className={classes.statusContainer}>
          <div>
            <Typography className={classes.sectionTitle} gutterBottom>
              Button Stats
            </Typography>
            <table className={classes.statsTable}>
              <tbody>
                <tr>
                  <td className={classes.statLabel}>Count</td>
                  <td>{buttonPushedCount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Ws101;