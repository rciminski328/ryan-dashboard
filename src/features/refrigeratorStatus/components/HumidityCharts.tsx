import { Divider, Grid, Typography, makeStyles } from '@material-ui/core';
import { AssetType } from '@clearblade/ia-mfe-core';
import TrendChart from './TrendChart';
import clsx from 'clsx';
import { chartHeight } from '../../../utils';
import StatsTable from './StatsTable';
import { useHumidityHistoryQuery } from '../api/humidityHistory';
import { humidityAndTempLabels } from '../utils';

const humidityChartStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
  section: {
    border: `1px solid ${theme.palette.divider}`,
    height: chartHeight,
  },
  table: {
    width: '100%',
  },
}));

export default function HumidityCharts({
  assetId,
  current,
}: {
  assetId: string;
  current: number;
}) {
  const classes = humidityChartStyles();
  const {
    data: { stats },
  } = useHumidityHistoryQuery({ assetId });

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
          <Typography variant='body2'>Current Humidity</Typography>
        </Grid>
        <Grid item>
          <Typography variant='h6'>{current} </Typography>
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
          <Typography variant='body2'>Humidity Stats (24 Hrs)</Typography>
        </Grid>
        <Grid item className={classes.table}>
          <StatsTable labels={humidityAndTempLabels} stats={stats} />
        </Grid>
      </Grid>
    </Grid>
  );
}
