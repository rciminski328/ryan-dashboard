import { Divider, Grid, Typography, makeStyles } from '@material-ui/core';
import { AssetType } from '@clearblade/ia-mfe-core';
import TrendChart from './TrendChart';
import clsx from 'clsx';
import { chartHeight } from '../../utils';
import StatsTable from './StatsTable';

const tempChartStyles = makeStyles((theme) => ({
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

export default function TemperatureCharts({
  attribute,
}: {
  attribute: AssetType['frontend']['schema'][number];
}) {
  const classes = tempChartStyles();
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
      >
        <Grid item>
          <Typography variant='body2'>Current Temperature</Typography>
        </Grid>
        <Grid item>current</Grid>
      </Grid>

      <Grid container item xs={3} wrap='wrap' className={classes.section}>
        <Grid item>
          <Typography variant='body2'>Temperature Stats (24 Hrs)</Typography>
        </Grid>
        <Grid item className={classes.table}>
          <StatsTable />
        </Grid>
      </Grid>
    </Grid>
  );
}
