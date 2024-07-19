import React from "react";
import { Card, Grid, Typography, makeStyles } from "@material-ui/core";
import Plot from "react-plotly.js";
import {
  Ws202Asset,
  useWs202HistoryQuery,
  useLiveDataForWs202,
} from "../api/ws202_history";
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
  label: {
    marginBottom: theme.spacing(2),
  },
  statusContainer: {
    display: "flex",
    alignItems: "center",
  },
  statusIcon: {
    marginRight: theme.spacing(1),
  },
  detected: {
    color: "green",
  },
  notDetected: {
    color: "red",
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

const Ws202: React.FC<{ assetId: string; timeRange: RelativeOrAbsoluteRange }> = ({
  assetId,
  timeRange,
}) => {
  const classes = useStyles();

  const assetQuery = useAsset<Ws202Asset>(assetId);

  const { data: historyData } = useWs202HistoryQuery({
    assetId: assetId,
    timeRange,
  });

  useLiveDataForWs202({
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

  // Convert 1 to "true" and 0 to "false" for hover information
  const motionData = historyData.data.motion.y.map(val => val ? "true" : "false");
  const daylightData = historyData.data.daylight.y.map(val => val ? "true" : "false");

  // Calculate statistics for motion and daylight
  const motionStats = getStats(historyData.data.motion.y);
  const daylightStats = getStats(historyData.data.daylight.y);

  return (
    <Card>
      <Grid container spacing={1} className={classes.container}>
        {/* Motion Detection Section */}
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>{`${label} - Motion Detection Audit`}</strong></Typography>
            <Plot
              data={[
                {
                  x: historyData.data.motion.x,
                  y: historyData.data.motion.y,
                  type: "scatter",
                  mode: "lines",
                  line: { shape: 'hv' }, // step line
                  marker: { color: "blue" },
                  hovertemplate: `<b>Date:</b> %{x|%m/%d/%y}, %{x|%I:%M %p}<br><b>Motion Detected:</b> %{y}<extra></extra>`,
                },
              ]}
              layout={{
                title: "Motion Detection Audit",
                xaxis: {
                  title: { text: "Time", standoff: 20 }, // Move 'Time' label down
                  tickformat: "%I:%M %p", // Format to display time as "hh:mm AM/PM"
                  nticks: 10, // Adjust the number of ticks to make it more readable
                },
                yaxis: { 
                  title: "Motion Detected",
                  tickvals: [0, 1], // Ensure the correct values are used
                  ticktext: ["false", "true"], // Correctly map 0 to "false" and 1 to "true"
                  range: [0, 1], // Set range to cover the values 0 and 1
                },
                height: 300,
                margin: { t: 40, b: 60, l: 40, r: 40 }, // Increase bottom margin
              }}
              className={classes.plot}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Motion Detected</strong></Typography>
            <div className={classes.statusContainer}>
              {custom_data.motion ? (
                <>
                  <CheckCircleIcon className={`${classes.statusIcon} ${classes.detected}`} />
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
            <Typography variant="subtitle1"><strong>Occupancy Stats</strong></Typography>
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
                  <td>{historyData.data.motion.count}</td> {/* Display motion count */}
                </tr>
                <tr>
                  <td>Average Duration</td>
                  <td>{motionStats.average.toFixed(2)} sec</td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>

        {/* Daylight Detection Section */}
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>{`${label} - Daylight Detection Audit`}</strong></Typography>
            <Plot
              data={[
                {
                  x: historyData.data.daylight.x,
                  y: historyData.data.daylight.y,
                  type: "scatter",
                  mode: "lines",
                  line: { shape: 'hv' }, // step line
                  marker: { color: "yellow" },
                  hovertemplate: `<b>Date:</b> %{x|%m/%d/%y}, %{x|%I:%M %p}<br><b>Daylight Detected:</b> %{y}<extra></extra>`,
                },
              ]}
              layout={{
                title: "Daylight Detection Audit",
                xaxis: {
                  title: { text: "Time", standoff: 20 }, // Move 'Time' label down
                  tickformat: "%I:%M %p", // Format to display time as "hh:mm AM/PM"
                  nticks: 10, // Adjust the number of ticks to make it more readable
                },
                yaxis: { 
                  title: "Daylight Detected",
                  tickvals: [0, 1], // Ensure the correct values are used
                  ticktext: ["false", "true"], // Correctly map 0 to "false" and 1 to "true"
                  range: [0, 1], // Set range to cover the values 0 and 1
                },
                height: 300,
                margin: { t: 40, b: 60, l: 40, r: 40 }, // Increase bottom margin
              }}
              className={classes.plot}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Daylight Detected</strong></Typography>
            <div className={classes.statusContainer}>
              {custom_data.daylight ? (
                <>
                  <CheckCircleIcon className={`${classes.statusIcon} ${classes.detected}`} />
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
            <Typography variant="subtitle1"><strong>Daylight Stats</strong></Typography>
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
                  <td>{historyData.data.daylight.count}</td> {/* Display daylight count */}
                </tr>
                <tr>
                  <td>Average Duration</td>
                  <td>{daylightStats.average.toFixed(2)} sec</td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Ws202;
