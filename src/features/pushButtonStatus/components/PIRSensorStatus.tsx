import React from 'react';
import Plot from 'react-plotly.js';
import { Box, Grid, Typography, makeStyles } from '@material-ui/core';
import StatsTable from './StatsTable';
import { min, max, mean, median, standardDeviation } from 'simple-statistics';

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
  plot: {
    width: '100%',
    height: 300, // Reduce the height of the plot
  },
}));

const PIRSensorStatus: React.FC = () => {
  const classes = useStyles();

  // Dummy data
  const timeData = ['2021-01-01', '2021-01-02', '2021-01-03'];
  const daylightData = [0, 1, 1];
  const motionData = [1, 0, 1];

  const daylightStats = {
    minDaylight: min(daylightData),
    maxDaylight: max(daylightData),
    averageDaylight: mean(daylightData),
    medianDaylight: median(daylightData),
    stdDevDaylight: standardDeviation(daylightData),
  };

  const motionStats = {
    minMotion: min(motionData),
    maxMotion: max(motionData),
    averageMotion: mean(motionData),
    medianMotion: median(motionData),
    stdDevMotion: standardDeviation(motionData),
  };

  const daylightLabels = [
    { field: 'minDaylight', label: 'Min Daylight' },
    { field: 'maxDaylight', label: 'Max Daylight' },
    { field: 'averageDaylight', label: 'Average Daylight' },
    { field: 'medianDaylight', label: 'Median Daylight' },
    { field: 'stdDevDaylight', label: 'Standard Deviation' },
  ];

  const motionLabels = [
    { field: 'minMotion', label: 'Min Motion' },
    { field: 'maxMotion', label: 'Max Motion' },
    { field: 'averageMotion', label: 'Average Motion' },
    { field: 'medianMotion', label: 'Median Motion' },
    { field: 'stdDevMotion', label: 'Standard Deviation' },
  ];

  return (
    <Grid container item spacing={1} className={classes.container}>
      <Grid container direction="column" item xs={6} className={classes.section}>
        <Grid item>
          <Typography variant="subtitle1">Daylight Over Time</Typography>
          <Plot
            data={[
              {
                x: timeData,
                y: daylightData,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'yellow' },
              },
            ]}
            layout={{ title: 'Daylight Over Time', xaxis: { title: 'Time' }, yaxis: { title: 'Daylight' } }}
            className={classes.plot}
          />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">Daylight Stats</Typography>
          <StatsTable labels={daylightLabels} stats={daylightStats} />
        </Grid>
      </Grid>
      <Grid container direction="column" item xs={6}>
        <Grid item>
          <Typography variant="subtitle1">Motion Over Time</Typography>
          <Plot
            data={[
              {
                x: timeData,
                y: motionData,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'red' },
              },
            ]}
            layout={{ title: 'Motion Over Time', xaxis: { title: 'Time' }, yaxis: { title: 'Motion' } }}
            className={classes.plot}
          />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">Motion Stats</Typography>
          <StatsTable labels={motionLabels} stats={motionStats} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PIRSensorStatus;
