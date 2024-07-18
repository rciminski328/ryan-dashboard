// StaticPlot.tsx
import React from "react";
import Plot from "react-plotly.js";
import { Card, Grid, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
  },
  section: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  plot: {
    width: "100%",
    height: 300,
  },
}));

const StaticPlot: React.FC = () => {
  const classes = useStyles();

  const temperatureData = [20, 21, 22, 23, 24, 25];
  const humidityData = [40, 42, 44, 46, 48, 50];
  const co2Data = [380, 390, 400, 410, 420, 430];
  const timeData = [
    "2024-07-15T12:00:00",
    "2024-07-15T13:00:00",
    "2024-07-15T14:00:00",
    "2024-07-15T15:00:00",
    "2024-07-15T16:00:00",
    "2024-07-15T17:00:00",
  ].map((timestamp) => new Date(timestamp).toLocaleString());

  return (
    <Card>
      <Grid container item spacing={1} className={classes.container}>
        <Grid
          container
          direction="column"
          item
          xs={4}
          className={classes.section}
        >
          <Grid item>
            <Typography variant="subtitle1">Current State</Typography>
            <p>Temperature: 22 °C</p>
            <p>Humidity: 45 %</p>
            <p>Co2: 400 ppm</p>
          </Grid>
        </Grid>

        <Grid
          container
          direction="column"
          item
          xs={8}
          className={classes.section}
        >
          <Grid item>
            <Typography variant="subtitle1">Temperature Over Time</Typography>
            <Plot
              data={[
                {
                  x: timeData,
                  y: temperatureData,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "blue" },
                },
              ]}
              layout={{
                title: "Temperature Over Time",
                xaxis: { title: "Time" },
                yaxis: { title: "Temperature (°C)" },
              }}
              className={classes.plot}
            />
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">Humidity Over Time</Typography>
            <Plot
              data={[
                {
                  x: timeData,
                  y: humidityData,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "green" },
                },
              ]}
              layout={{
                title: "Humidity Over Time",
                xaxis: { title: "Time" },
                yaxis: { title: "Humidity (%)" },
              }}
              className={classes.plot}
            />
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">CO2 Over Time</Typography>
            <Plot
              data={[
                {
                  x: timeData,
                  y: co2Data,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "red" },
                },
              ]}
              layout={{
                title: "CO2 Over Time",
                xaxis: { title: "Time" },
                yaxis: { title: "CO2 (ppm)" },
              }}
              className={classes.plot}
            />
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default StaticPlot;
