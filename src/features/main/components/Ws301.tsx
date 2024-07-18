// Ws301.tsx
// @ts-nocheck
import React from "react";
import { Card, Grid, Typography, makeStyles } from "@material-ui/core";
import Plot from "react-plotly.js";
import {
  Ws301Asset,
  useWs301HistoryQuery,
  useLiveDataForWs301,
} from "../api/ws301_history";
import { useAsset } from "../api/assetsQuery";
import { RelativeOrAbsoluteRange } from "../utils/types";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

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
  statusContainer: {
    display: "flex",
    alignItems: "center",
  },
  statusIcon: {
    marginRight: theme.spacing(1),
  },
  open: {
    color: "green",
  },
  closed: {
    color: "red",
  },
  label: {
    marginBottom: theme.spacing(2),
  },
}));

const Ws301: React.FC<{ assetId: string; timeRange: RelativeOrAbsoluteRange }> = ({
  assetId,
  timeRange,
}) => {
  const classes = useStyles();

  const assetQuery = useAsset<Ws301Asset>(assetId);

  const { data: historyData } = useWs301HistoryQuery({
    assetId: assetId,
    timeRange,
  });

  useLiveDataForWs301({
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

  return (
    <Card>
      <Grid container item spacing={1} className={classes.container}>
        <Grid
          container
          direction="column"
          item
          xs={4}
          className={classes.section}
        >
          <Grid item>
            <Typography variant="subtitle1">Current State</Typography>
            <Typography variant="h6" className={classes.label}>{label}</Typography>
            <div className={classes.statusContainer}>
              {custom_data.isOpen ? (
                <CheckCircleIcon className={`${classes.statusIcon} ${classes.open}`} />
              ) : (
                <CancelIcon className={`${classes.statusIcon} ${classes.closed}`} />
              )}
              <Typography variant="body1">
                Door Status: {custom_data.isOpen ? "Open" : "Closed"}
              </Typography>
            </div>
          </Grid>
        </Grid>

        <Grid
          container
          direction="column"
          item
          xs={8}
          className={classes.section}
        >
          <Grid item>
            <Typography variant="subtitle1">Door Status Over Time</Typography>
            <Plot
              data={[
                {
                  x: historyData.data.doorOpen.x,
                  y: historyData.data.doorOpen.y,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: historyData.data.doorOpen.y.map((value) => (value ? "green" : "red")) },
                },
              ]}
              layout={{
                title: "Door Status Over Time",
                xaxis: { title: "Time" },
                yaxis: { title: "Door Status" },
              }}
              className={classes.plot}
            />
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Ws301;
