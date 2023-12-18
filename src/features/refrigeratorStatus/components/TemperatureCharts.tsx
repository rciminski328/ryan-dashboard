import { Divider, Grid, Typography, makeStyles } from '@material-ui/core';
import { AssetType } from '@clearblade/ia-mfe-core';
import TrendChart from './TrendChart';
import clsx from 'clsx';
import { graphChartHeight } from '../../../utils';
import StatsTable from './StatsTable';
import { useTemperatureHistoryQuery } from '../api/temperatureHistory';
import { humidityAndTempLabels } from '../utils';

const tempChartStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
  section: {
    border: `1px solid ${theme.palette.divider}`,
    height: graphChartHeight,
  },
  table: {
    width: '100%',
  },
}));

export default function TemperatureCharts({
  assetId,
  current,
}: {
  assetId: string;
  current: number;
}) {
  const classes = tempChartStyles();
  const {
    data: { stats },
  } = useTemperatureHistoryQuery({ assetId });

  return (
    <Grid container item spacing={1} className={classes.container}>
      <Grid
        container
        direction='column'
        item
        xs={6}
        className={classes.section}
      >
        <Grid item>
          <TrendChart />
        </Grid>
      </Grid>

      <Grid
        container
        direction='column'
        item
        xs={3}
        className={classes.section}
        alignItems='center'
      >
        <Grid item>
          <Typography variant='body2'>Current Temperature</Typography>
        </Grid>
        <Grid item>
          <Typography variant='h6'>{current}</Typography> does celsius go below?
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={3}
        wrap='wrap'
        className={classes.section}
        justifyContent='center'
      >
        <Grid item>
          <Typography variant='body2'>Temperature Stats (24 Hrs)</Typography>
        </Grid>
        <Grid item className={classes.table}>
          <StatsTable labels={humidityAndTempLabels} stats={stats} />
        </Grid>
      </Grid>
    </Grid>
  );
}