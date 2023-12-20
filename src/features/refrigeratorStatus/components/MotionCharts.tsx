import { Box, Grid, Typography, makeStyles } from "@material-ui/core";
import TrendChart from "./TrendChart";
import { Skeleton } from "@material-ui/lab";
import { useMotionHistoryQuery } from "../api/motionHistory";

const useMotionChartStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
  },
  section: {
    border: `1px solid ${theme.palette.divider}`,
  },
  table: {
    width: "100%",
  },
}));

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

  const { data } = motionHistoryQuery.data;

  return (
    <Grid container item spacing={1} className={classes.container}>
      <Grid
        container
        direction="column"
        item
        xs={6}
        className={classes.section}
      >
        <Grid item>
          <TrendChart
            title="Motion Trend"
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
        <Typography variant="subtitle1">Motion Status</Typography>
        <Box flex={1} display={"flex"} alignItems={"center"}>
          <Typography variant="h4">{current ? "YES" : "NO"}</Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
