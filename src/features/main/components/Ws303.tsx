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

const Ws303: React.FC<{ assetId: string; timeRange: RelativeOrAbsoluteRange }> = ({
  assetId,
  timeRange,
}) => {
  const classes = useStyles();

  const assetQuery = useAsset<Ws303Asset>(assetId);

  const { data: historyData } = useWs303HistoryQuery({
    assetId: assetId,
    timeRange,
  });

  useLiveDataForWs303({
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

  // Ensure historyData and its properties are defined before accessing them
  const leakDetectedData = historyData?.data?.leakDetected || { x: [], y: [] };

  // Calculate statistics for leak detection
  const leakStats = getStats(leakDetectedData.y);

  return (
    <Card>
      <Typography variant="h4">{label}</Typography>
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
                },
              ]}
              layout={{
                xaxis: {
                  visible: false,
                },
                yaxis: {
                  visible: false,
                },
                height: 300,
                margin: { t: 40, b: 0, l: 40, r: 40 }, // Adjust margins
              }}
              config={{ displayModeBar: false }}
              className={classes.plot}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"><strong>Leak Detected</strong></Typography>
            <div className={classes.statusContainer}>
              {custom_data.leakDetected ? (
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
                  <td>Count</td>
                  <td>{leakStats.count}</td>
                </tr>
                <tr>
                  <td>Times Leaked</td>
                  <td>{leakStats.count}</td>
                </tr>
                <tr>
                  <td>Average Duration</td>
                  <td>{leakStats.average.toFixed(2)} sec</td>
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
