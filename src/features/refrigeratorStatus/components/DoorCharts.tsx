import { Box, Card, Grid, Typography, makeStyles } from "@material-ui/core";
import TrendChart from "./TrendChart";
import StatsTable from "./StatsTable";
import { useDoorOpenHistoryQuery } from "../api/doorOpenHistory";
import { Skeleton } from "@material-ui/lab";

const doorChartStyles = makeStyles((theme) => ({
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

export default function DoorCharts({
  doorOpenHistoryQuery,
  current,
}: {
  doorOpenHistoryQuery: ReturnType<typeof useDoorOpenHistoryQuery>;
  current: boolean;
}) {
  const classes = doorChartStyles();
  const labels = [
    {
      field: "times",
      label: "Times",
    },
    {
      field: "averageDurationMs",
      label: "Average Duration",
      format: (val: number) => `${(val / 1000).toFixed(2)} sec`,
    },
  ];

  if (doorOpenHistoryQuery.isLoading) {
    return (
      <Grid container item spacing={1} className={classes.container}>
        <Box pt={1} />
        <Skeleton variant="rect" height={200} width="100%" />
      </Grid>
    );
  }

  if (!doorOpenHistoryQuery.isSuccess) {
    return null;
  }

  const { data, stats } = doorOpenHistoryQuery.data;

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
            title="Door Open/Close"
            data={[{ ...data, type: "scatter" }]}
          />
        </Grid>
      </Grid>

      <Grid
        container
        direction="column"
        item
        xs={3}
        className={classes.section}
        alignItems="center"
      >
        <Typography variant="subtitle1">Current Door Status</Typography>
        <Box flex={1} display={"flex"} alignItems={"center"}>
          <Typography variant="h4">{current ? "OPEN" : "CLOSED"}</Typography>
        </Box>
      </Grid>

      <Grid container item xs={3} wrap="wrap" justifyContent="center">
        <Grid item>
          <Typography variant="subtitle1">Door Open Stats</Typography>
        </Grid>
        <Grid item className={classes.table}>
          <StatsTable labels={labels} stats={stats} />
        </Grid>
      </Grid>
    </Grid>
  );
}
