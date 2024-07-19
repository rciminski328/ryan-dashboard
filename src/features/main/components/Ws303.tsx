// Ws303.tsx
// @ts-nocheck
import React from "react";
import { Card, Grid, Typography, makeStyles } from "@material-ui/core";
import Plot from "react-plotly.js";
import {
  Ws303Asset,
  useWs303HistoryQuery,
  useLiveDataForWs303,
} from "../api/ws303_history";
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

  // Calculate statistics for leak detection
  const leakStats = getStats(leakDetectedData.y);

  return (
    <Card>
      <Grid container spacing={1} className={classes.container}>
        {/* Leak Detection Section */}
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>{`${label} - Leak Detection Audit`}</strong></Typography>
            <Plot
              data={[
                {
                  x: leakDetectedData.x,
                  y: leakDetectedData.y,
                  type: "scatter",
                  mode: "lines",
                  line: { shape: 'hv' }, // step line
                  marker: { color: leakDetectedData.y.map((value) => (value ? "green" : "red")) },
                  hovertemplate: `<b>Date:</b> %{x|%m/%d/%y}, %{x|%I:%M %p}<br><b>Leak Detected:</b> %{y}<extra></extra>`,
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
            <Typography variant="subtitle1"><strong>Leak Detected</strong></Typography>
            <div className={classes.statusContainer}>
              {custom_data.leak_detected ? (
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
            <Typography variant="subtitle1"><strong>Leak Stats</strong></Typography>
            <table className={classes.statsTable}>
              <thead>
                <tr>
                  <th>Statistic</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Times Leaked</td>
                  <td>{leakStats.count}</td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Ws303;
