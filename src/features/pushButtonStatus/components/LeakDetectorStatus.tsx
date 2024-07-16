import React from 'react';
import { Box, Grid, Typography, makeStyles } from '@material-ui/core';
import StaticGaugePlot from './StaticGaugePlot';
import StatsTable from './StatsTable';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
  section: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  table: {
    width: '100%',
  },
}));

const LeakDetectorStatus: React.FC = () => {
  const classes = useStyles();

  // Dummy data
  const currentStatus = false;
  const stats = {
    times: 2,
    averageDurationMs: 3000,
  };

  const labels = [
    { field: 'times', label: 'Times Detected' },
    { field: 'averageDurationMs', label: 'Average Detection Duration (ms)' },
  ];

  return (
    <Grid container item spacing={1} className={classes.container}>
      <Grid container direction="column" item xs={6} className={classes.section}>
        <Grid item>
          <Typography variant="subtitle1">Current Leak Status</Typography>
          <Box display="flex" alignItems="center" justifyContent="center" height={100}>
            <Typography variant="h4">{currentStatus ? 'LEAK DETECTED' : 'NO LEAK'}</Typography>
          </Box>
        </Grid>
        <Grid item>
          <StaticGaugePlot />
        </Grid>
      </Grid>
      <Grid container item xs={6} justifyContent="center">
        <Grid item>
          <Typography variant="subtitle1">Leak Detector Stats</Typography>
          <StatsTable labels={labels} stats={stats} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LeakDetectorStatus;