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

const DoorSensorStatus: React.FC = () => {
  const classes = useStyles();

  // Dummy data
  const currentStatus = true;
  const stats = {
    times: 5,
    averageDurationMs: 1500,
  };

  const labels = [
    { field: 'times', label: 'Times Opened' },
    { field: 'averageDurationMs', label: 'Average Open Duration (ms)' },
  ];

  return (
    <Grid container item spacing={1} className={classes.container}>
      <Grid container direction="column" item xs={6} className={classes.section}>
        <Grid item>
          <Typography variant="subtitle1">Current Door Status</Typography>
          <Box display="flex" alignItems="center" justifyContent="center" height={100}>
            <Typography variant="h4">{currentStatus ? 'OPEN' : 'CLOSED'}</Typography>
          </Box>
        </Grid>
        <Grid item>
          <StaticGaugePlot />
        </Grid>
      </Grid>
      <Grid container item xs={6} justifyContent="center">
        <Grid item>
          <Typography variant="subtitle1">Door Sensor Stats</Typography>
          <StatsTable labels={labels} stats={stats} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DoorSensorStatus;
