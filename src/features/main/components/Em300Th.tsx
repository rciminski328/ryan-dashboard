// Em300Th.tsx
// @ts-nocheck
import React from "react";
import { Card, Grid, Typography, makeStyles, Box, Divider, useTheme } from "@material-ui/core";
import Plot from "react-plotly.js";
import {
  Em300ThAsset,
  useEm300ThHistoryQuery,
  useLiveDataForEm300Th,
} from "../api/em300_th_history";
import { useAsset } from "../api/assetsQuery";
import { RelativeOrAbsoluteRange } from "../utils/types";
import { getStats } from "../../../utils/getStats"; // import the existing utility function

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontFamily: 'Arial, sans-serif',
  },
  container: {
    width: "100%",
  },
  plot: {
    width: "100%",
    height: 200,
  },
  statusContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100%",
  },
  statsTable: {
    marginTop: theme.spacing(1),
    '& th, & td': {
      padding: theme.spacing(0.5),
      textAlign: 'left',
      fontSize: '1rem',
    },
  },
  largeText: {
    fontSize: "1.5rem", // Larger text for better visibility
    fontWeight: "bold",
  },
  divider: {
    margin: `${theme.spacing(0.5)}px 0`,
    width: "100%", // Adjust the width to make the divider longer
  },
  verticalDivider: {
    margin: theme.spacing(0, 2), // Adjust the space between the vertical dividers
    height: "120%",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: "1rem", // Enlarged font size for section title
    textAlign: "center", // Center align the section title
  },
  tableRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1), // Add padding for more spacing
  },
  statLabel: {
    marginRight: theme.spacing(1), // Add space between label and value
  },
}));

const Em300Th: React.FC<{ assetId: string; timeRange: RelativeOrAbsoluteRange }> = ({
  assetId,
  timeRange,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const assetQuery = useAsset<Em300ThAsset>(assetId);
  const { data: historyData } = useEm300ThHistoryQuery({
    assetId: assetId,
    timeRange,
  });

  useLiveDataForEm300Th({
    assetId: assetId,
    timeRange,
  });

  if (assetQuery.isLoading || !historyData) {
    return <div>Loading...</div>;
  }

  if (assetQuery.isError) {
    return <div>Error loading data</div>;
  }

  const custom_data = assetQuery.data.custom_data;
  const label = assetQuery.data.label;

  // Calculate statistics for temperature and humidity
  const temperatureStats = getStats(historyData.data.temperature.y);
  const humidityStats = getStats(historyData.data.humidity.y);

  const renderGaugeChart = (title, value, units) => {
    const data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value,
        number: { suffix: units },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          bar: { color: theme.palette.primary.main },
          axis: { range: [-10, 120] },
          steps: [
            { range: [-10, 50], color: "red" },
            { range: [50, 68], color: "yellow" },
            { range: [68, 78], color: "green" },
            { range: [78, 82], color: "yellow" },
            { range: [82, 120], color: "red" },
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: custom_data.temperature,
          },
        },
      },
    ];

    return (
      <Box textAlign={"center"}>
        <Typography>{title}</Typography>
        <Plot
          data={data}
          config={{
            responsive: true,
            displayModeBar: false,
            displaylogo: false,
          }}
          layout={{
            autosize: true,
            margin: { t: 50, b: 50 },
            titlefont: {
              size: 16,
              family: theme.typography.fontFamily,
            },
          }}
          style={{
            width: "100%",
            height: "100%",
            minHeight: 300, // Enlarge the gauge
            minWidth: 300,
          }}
        />
      </Box>
    );
  };

  return (
    <Card className={classes.card}>
      <Grid container spacing={1}>
        {/* Temperature Section */}
        <Grid item xs={12} className={classes.container}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography className={classes.sectionTitle} noWrap>
              {`${label} - Temperature Trend (°F)`}
            </Typography>
          </Box>
        </Grid>

        <Grid container item xs={12} spacing={1}>
          {/* Temperature Trend Chart */}
          <Grid item xs={12} md={4} className={classes.container}>
            <Plot
              data={[
                {
                  x: historyData.data.temperature.x,
                  y: historyData.data.temperature.y,
                  type: "scatter",
                  mode: "lines+markers",
                  line: { shape: 'linear', width: 4 }, // step line and increased width
                  marker: { color: "blue" },
                },
              ]}
              layout={{
                xaxis: {
                  title: { text: "Time", standoff: 20 },
                  tickformat: "%I:%M %p",
                  nticks: 10,
                },
                height: 200,
                margin: { t: 40, b: 60, l: 40, r: 40 },
              }}
              className={classes.plot}
            />
          </Grid>

          {/* Vertical Divider */}
          <Divider orientation="vertical" flexItem className={classes.verticalDivider} />

          {/* Current Temperature */}
          <Grid item xs={12} md={3} className={classes.statusContainer}>
            {renderGaugeChart("Current Temperature", custom_data.temperature, "°F")}
          </Grid>

          {/* Vertical Divider */}
          <Divider orientation="vertical" flexItem className={classes.verticalDivider} />

          {/* Temperature Stats */}
          <Grid item xs={12} md={4} className={classes.statusContainer}>
            <div>
              <Typography className={classes.sectionTitle} gutterBottom>Temperature Stats</Typography>
              <table className={classes.statsTable}>
                <tbody>
                  <tr>
                    <td className={classes.statLabel}>Min</td>
                    <td>{temperatureStats.min.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <Divider className={classes.divider} />
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.statLabel}>Max</td>
                    <td>{temperatureStats.max.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <Divider className={classes.divider} />
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.statLabel}>Average</td>
                    <td>{temperatureStats.average.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <Divider className={classes.divider} />
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.statLabel}>Median</td>
                    <td>{temperatureStats.median.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <Divider className={classes.divider} />
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.statLabel}>Std Dev</td>
                    <td>{temperatureStats.stdDev.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Grid>
        </Grid>

        <Divider className={classes.divider} />

        {/* Humidity Section */}
        <Grid item xs={12} className={classes.container}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography className={classes.sectionTitle} noWrap>
              {`${label} - Humidity Trend (%)`}
            </Typography>
          </Box>
        </Grid>

        <Grid container item xs={12} spacing={1}>
          {/* Humidity Trend Chart */}
          <Grid item xs={12} md={4} className={classes.container}>
            <Plot
              data={[
                {
                  x: historyData.data.humidity.x,
                  y: historyData.data.humidity.y,
                  type: "scatter",
                  mode: "lines+markers",
                  line: { shape: 'linear', width: 4 }, // step line and increased width
                  marker: { color: "green" },
                },
              ]}
              layout={{
                xaxis: {
                  title: { text: "Time", standoff: 20 },
                  tickformat: "%I:%M %p",
                  nticks: 10,
                },
                height: 200,
                margin: { t: 40, b: 60, l: 40, r: 40 },
              }}
              className={classes.plot}
            />
          </Grid>

          {/* Vertical Divider */}
          <Divider orientation="vertical" flexItem className={classes.verticalDivider} />

          {/* Current Humidity */}
          <Grid item xs={12} md={3} className={classes.statusContainer}>
            {renderGaugeChart("Current Humidity", custom_data.humidity, "%")}
          </Grid>

          {/* Vertical Divider */}
          <Divider orientation="vertical" flexItem className={classes.verticalDivider} />

          {/* Humidity Stats */}
          <Grid item xs={12} md={4} className={classes.statusContainer}>
            <div>
              <Typography className={classes.sectionTitle} gutterBottom>Humidity Stats</Typography>
              <table className={classes.statsTable}>
                <tbody>
                  <tr>
                    <td className={classes.statLabel}>Min</td>
                    <td>{humidityStats.min.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <Divider className={classes.divider} />
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.statLabel}>Max</td>
                    <td>{humidityStats.max.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <Divider className={classes.divider} />
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.statLabel}>Average</td>
                    <td>{humidityStats.average.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <Divider className={classes.divider} />
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.statLabel}>Median</td>
                    <td>{humidityStats.median.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <Divider className={classes.divider} />
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.statLabel}>Std Dev</td>
                    <td>{humidityStats.stdDev.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Em300Th;
