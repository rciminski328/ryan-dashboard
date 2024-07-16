// @ts-nocheck
import { Box, Typography, useTheme } from "@material-ui/core";
import React from "react";
import Plot from "react-plotly.js";

const StaticGaugePlot: React.FC = () => {
  const theme = useTheme();

  const data = [
    {
      type: "indicator",
      mode: "gauge+number",
      value: 0.5, // Static value
      number: { suffix: "" },
      gauge: {
        bar: { color: theme.palette.primary.main },
        axis: { range: [null, 1] }, // Adjust range as needed
      },
    },
  ];

  const layout = {
    autosize: true,
    margin: { t: 50, b: 50 },
    title: {
      text: "Static Gauge Plot",
      font: {
        size: 16,
        family: theme.typography.fontFamily,
      },
    },
  };

  return (
    <Box textAlign="center">
      <Typography>Static Gauge Plot</Typography>
      <Plot
        data={data}
        layout={layout}
        style={{ width: "100%", height: "100%" }}
      />
    </Box>
  );
};

export default StaticGaugePlot;
