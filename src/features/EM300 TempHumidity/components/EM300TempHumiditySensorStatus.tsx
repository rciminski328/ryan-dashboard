// @ts-nocheck
import { Card, Grid, Typography, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import Plot from "react-plotly.js";
import StatsTable from "../../../components/StatsTable"; // Corrected import path
import { useHumidityHistoryQuery, useTemperatureHistoryQuery } from "../api";
import { RelativeOrAbsoluteRange, TimeUnitMultiplier } from "../utils/types";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
  },
  section: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  table: {
    width: "100%",
  },
  plot: {
    width: "100%",
    height: 300, // Reduced height of the plot
  },
}));

const EM300TempHumiditySensorStatus: React.FC<{ assetId: string }> = ({
  assetId,
}) => {
  const classes = useStyles();
  const [timeRange, setTimeRange] = useState<RelativeOrAbsoluteRange>({
    type: "relative",
    count: 1,
    units: TimeUnitMultiplier.DAYS,
  });

  const temperatureHistoryQuery = useTemperatureHistoryQuery({
    assetId,
    timeRange,
  });

  const humidityHistoryQuery = useHumidityHistoryQuery({
    assetId,
    timeRange,
  });

  if (temperatureHistoryQuery.isLoading || humidityHistoryQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (temperatureHistoryQuery.isError || humidityHistoryQuery.isError) {
    return <div>Error loading data</div>;
  }

  const temperatureData = temperatureHistoryQuery.data?.data.y || [];
  const humidityData = humidityHistoryQuery.data?.data.y || [];
  const timeData = temperatureHistoryQuery.data?.data.x || [];

  const temperatureStats = temperatureHistoryQuery.data?.stats || {};
  const humidityStats = humidityHistoryQuery.data?.stats || {};

  const temperatureLabels = [
    { field: "min", label: "Min Temperature (°C)" },
    { field: "max", label: "Max Temperature (°C)" },
    { field: "mean", label: "Average Temperature (°C)" },
    { field: "median", label: "Median Temperature (°C)" },
    { field: "standardDeviation", label: "Standard Deviation (°C)" },
  ];

  const humidityLabels = [
    { field: "min", label: "Min Humidity (%)" },
    { field: "max", label: "Max Humidity (%)" },
    { field: "mean", label: "Average Humidity (%)" },
    { field: "median", label: "Median Humidity (%)" },
    { field: "standardDeviation", label: "Standard Deviation (%)" },
  ];

  return (
    <Card>
      <Grid container item spacing={1} className={classes.container}>
        <Grid
          container
          direction="column"
          item
          xs={6}
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
            <Typography variant="subtitle1">Temperature Stats</Typography>
            <StatsTable labels={temperatureLabels} stats={temperatureStats} />
          </Grid>
        </Grid>
        <Grid container direction="column" item xs={6}>
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
            <Typography variant="subtitle1">Humidity Stats</Typography>
            <StatsTable labels={humidityLabels} stats={humidityStats} />
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default EM300TempHumiditySensorStatus;
