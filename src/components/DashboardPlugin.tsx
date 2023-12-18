import { useState } from 'react';
import RefrigeratorStatus from '../features/refrigeratorStatus/RefrigeratorStatus';
import { makeStyles } from '@material-ui/core';

const usePluginStyles = makeStyles((theme) => ({
  plugin: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
}));

export default function DashboardPlugin() {
  const classes = usePluginStyles();
  return (
    <div className={classes.plugin}>
      <RefrigeratorStatus assetId='placeholder' />
    </div>
  );
}
