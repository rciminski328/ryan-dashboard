import { Box, Card, Grid, Typography, makeStyles } from "@material-ui/core";
import TrendChart from "./TrendChart";
import { Skeleton } from "@material-ui/lab";
import { useMotionHistoryQuery } from "../api/motionHistory";
import StatsTable from "./StatsTable";

const useMotionChartStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
  },
  section: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  table: {
    width: "100%",
  },
}));

const labels = [
  {
    field: "count",
    label: "Count",
  },
  {
    field: "averageDurationMs",
    label: "Average Duration",
    format: (val: number) => `${(val / 1000).toFixed(2)} sec`,
  },
];

export default function MotionCharts({
  motionHistoryQuery,
  current,
}: {
  motionHistoryQuery: ReturnType<typeof useMotionHistoryQuery>;
  current: boolean;
}) {
  const classes = useMotionChartStyles();

  if (motionHistoryQuery.isLoading) {
    return (
      <Grid container item spacing={1} className={classes.container}>
        <Box pt={1} />
        <Skeleton variant="rect" height={200} width="100%" />
      </Grid>
    );
  }

  if (!motionHistoryQuery.isSuccess) {
    return null;
  }

  const { data, stats } = motionHistoryQuery.data;

  return (
    <Grid
      container
      item
      spacing={1}
      className={classes.container}
      component={Card}
    >
      <Grid
        container
        direction="column"
        item
        xs={6}
        className={classes.section}
      >
        <Grid item>
          <TrendChart
            title="Motion Detection Audit"
            data={[{ ...data, type: "scatter" }]}
          />
        </Grid>
      </Grid>

      <Grid container direction="column" item xs={3} alignItems="center">
        <Typography variant="subtitle1">Current Occupancy Status</Typography>
        <Box flex={1} display={"flex"} alignItems={"center"}>
          <Typography variant="h4">{current ? "YES" : "NO"}</Typography>
        </Box>
      </Grid>

      <Grid container item xs={3} wrap="wrap" justifyContent="center">
        <Grid item>
          <Typography variant="subtitle1">Occupancy Stats</Typography>
        </Grid>
        <Grid item className={classes.table}>
          <StatsTable labels={labels} stats={stats} />
        </Grid>
      </Grid>
    </Grid>
  );
}
