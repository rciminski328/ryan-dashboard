import { Grid, Typography, makeStyles } from "@material-ui/core";
import TrendChart from "./TrendChart";
import { graphChartHeight } from "../../../utils";
import StatsTable from "./StatsTable";
import { useDoorOpenHistoryQuery } from "../api/doorOpenHistory";

const doorChartStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
  },
  section: {
    border: `1px solid ${theme.palette.divider}`,
    height: graphChartHeight,
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
          <TrendChart data={[{ ...data, type: "line" }]} />
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
        <Grid item>
          <Typography variant="body2">Current Status</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6">{current ? "OPEN" : "CLOSED"}</Typography>
        </Grid>
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
          <Typography variant="body2">Door Open Stats (24 Hrs)</Typography>
        </Grid>
        <Grid item className={classes.table}>
          <StatsTable labels={labels} stats={stats} />
        </Grid>
      </Grid>
    </Grid>
  );
}
