import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import EM300TempHumiditySensorStatus from './EM300TempHumiditySensorStatus';

const useStyles = makeStyles((theme) => ({
  plugin: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
}));

const DashboardPlugin: React.FC<{ assetId: string }> = ({ assetId }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.plugin} spacing={1}>
      <Grid item xs={12}>
        <EM300TempHumiditySensorStatus assetId={assetId} />
      </Grid>
    </Grid>
  );
};

export default DashboardPlugin;
