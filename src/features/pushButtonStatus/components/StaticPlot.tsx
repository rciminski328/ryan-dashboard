import React from 'react';
import Plot from 'react-plotly.js';
import { Layout, Partial, PlotData } from 'plotly.js';

const StaticPlot: React.FC = () => {
  const data: Partial<PlotData>[] = [
    {
      x: [1, 2, 3, 4, 5],
      y: [2, 3, 5, 7, 11],
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'red' },
    },
  ];

  const layout: Partial<Layout> = {
    title: 'Temperature Status',
    xaxis: {
      title: 'Time',
    },
    yaxis: {
      title: 'Temperature',
    },
  };

  return <Plot data={data} layout={layout} style={{ width: '100%', height: '100%' }} />;
};

export default StaticPlot;
