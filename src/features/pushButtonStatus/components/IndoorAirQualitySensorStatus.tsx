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

const IndoorAirQualitySensorStatus: React.FC = () => {
  const classes = useStyles();

  // Dummy data
  const timeData = ['2021-01-01', '2021-01-02', '2021-01-03'];
  const temperatureData = [22, 21, 23];
  const humidityData = [55, 60, 50];
  const co2Data = [400, 420, 410];

  const temperatureStats = {
    minTemperature: min(temperatureData),
    maxTemperature: max(temperatureData),
    averageTemperature: mean(temperatureData),
    medianTemperature: median(temperatureData),
    stdDevTemperature: standardDeviation(temperatureData),
  };

  const humidityStats = {
    minHumidity: min(humidityData),
    maxHumidity: max(humidityData),
    averageHumidity: mean(humidityData),
    medianHumidity: median(humidityData),
    stdDevHumidity: standardDeviation(humidityData),
  };

  const co2Stats = {
    minCO2: min(co2Data),
    maxCO2: max(co2Data),
    averageCO2: mean(co2Data),
    medianCO2: median(co2Data),
    stdDevCO2: standardDeviation(co2Data),
  };

  const temperatureLabels = [
    { field: 'minTemperature', label: 'Min Temperature (°C)' },
    { field: 'maxTemperature', label: 'Max Temperature (°C)' },
    { field: 'averageTemperature', label: 'Average Temperature (°C)' },
    { field: 'medianTemperature', label: 'Median Temperature (°C)' },
    { field: 'stdDevTemperature', label: 'Standard Deviation (°C)' },
  ];

  const humidityLabels = [
    { field: 'minHumidity', label: 'Min Humidity (%)' },
    { field: 'maxHumidity', label: 'Max Humidity (%)' },
    { field: 'averageHumidity', label: 'Average Humidity (%)' },
    { field: 'medianHumidity', label: 'Median Humidity (%)' },
    { field: 'stdDevHumidity', label: 'Standard Deviation (%)' },
  ];

  const co2Labels = [
    { field: 'minCO2', label: 'Min CO2 (ppm)' },
    { field: 'maxCO2', label: 'Max CO2 (ppm)' },
    { field: 'averageCO2', label: 'Average CO2 (ppm)' },
    { field: 'medianCO2', label: 'Median CO2 (ppm)' },
    { field: 'stdDevCO2', label: 'Standard Deviation (ppm)' },
  ];

  return (
    <Grid container item spacing={1} className={classes.container}>
      <Grid container direction="column" item xs={4} className={classes.section}>
        <Grid item>
          <Typography variant="subtitle1">Temperature Over Time</Typography>
          <Plot
            data={[
              {
                x: timeData,
                y: temperatureData,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'blue' },
              },
            ]}
            layout={{ title: 'Temperature Over Time', xaxis: { title: 'Time' }, yaxis: { title: 'Temperature (°C)' } }}
            className={classes.plot}
          />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">Temperature Stats</Typography>
          <StatsTable labels={temperatureLabels} stats={temperatureStats} />
        </Grid>
      </Grid>
      <Grid container direction="column" item xs={4} className={classes.section}>
        <Grid item>
          <Typography variant="subtitle1">Humidity Over Time</Typography>
          <Plot
            data={[
              {
                x: timeData,
                y: humidityData,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'green' },
              },
            ]}
            layout={{ title: 'Humidity Over Time', xaxis: { title: 'Time' }, yaxis: { title: 'Humidity (%)' } }}
            className={classes.plot}
          />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">Humidity Stats</Typography>
          <StatsTable labels={humidityLabels} stats={humidityStats} />
        </Grid>
      </Grid>
      <Grid container direction="column" item xs={4}>
        <Grid item>
          <Typography variant="subtitle1">CO2 Levels Over Time</Typography>
          <Plot
            data={[
              {
                x: timeData,
                y: co2Data,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'red' },
              },
            ]}
            layout={{ title: 'CO2 Levels Over Time', xaxis: { title: 'Time' }, yaxis: { title: 'CO2 (ppm)' } }}
            className={classes.plot}
          />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">CO2 Stats</Typography>
          <StatsTable labels={co2Labels} stats={co2Stats} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default IndoorAirQualitySensorStatus;
