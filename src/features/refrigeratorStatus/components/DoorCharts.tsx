import { Box, Grid, Typography, makeStyles } from "@material-ui/core";
import TrendChart from "./TrendChart";
import StatsTable from "./StatsTable";
import { useDoorOpenHistoryQuery } from "../api/doorOpenHistory";

const doorChartStyles = makeStyles((theme) => ({
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

export default function DoorCharts({
  assetId,
  current,
}: {
  assetId: string;
  current: boolean;
}) {
  const classes = doorChartStyles();
  const {
    data: { stats, data },
  } = useDoorOpenHistoryQuery({ assetId });
  const labels = [
    {
      field: "times",
      label: "Times",
    },
    {
      field: "averageDurationMs",
      label: "Average Duration",
      format: (val) => `${(val / 1000).toFixed(2)} sec`,
    },
  ];

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
            title="Door Open/Close"
            data={[{ ...data, type: "line" }]}
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
        <Typography variant="subtitle1">Current Status</Typography>
        <Box flex={1} display={"flex"} alignItems={"center"}>
          <Typography variant="h4">{current ? "OPEN" : "CLOSED"}</Typography>
        </Box>
      </Grid>

      <Grid
        container
        item
        xs={3}
        wrap="wrap"
        className={classes.section}
        justifyContent="center"
      >
        <Grid item>
          <Typography variant="subtitle1">Door Open Stats (24 Hrs)</Typography>
        </Grid>
        <Grid item className={classes.table}>
          <StatsTable labels={labels} stats={stats} />
        </Grid>
      </Grid>
    </Grid>
  );
}
