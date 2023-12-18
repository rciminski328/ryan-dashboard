import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { graphChartHeight } from '../../../utils';

export default function TrendChart() {
  const data = [
    {
      x: [1, 2, 3],
      y: [2, 6, 3],
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'red' },
    },
    { type: 'line', x: [1, 2, 3], y: [2, 5, 3] },
  ];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Plot
        data={data}
        //   onInitialized={(f) => setLayout(f.layout)}
        //   config={{
        //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //     // @ts-ignore
        //     locales: {
        //       [navigator.language]: getLocaleDictionary(navigator.language),
        //     }, // Absent from config type but needed to provide plotly translations.
        //     locale: navigator.language,
        //     responsive: true,
        //     displayModeBar: true,
        //     modeBarButtonsToRemove: ['toImage', 'zoom2d', 'select2d', 'lasso2d'],
        //     displaylogo: false,
        //   }}
        config={{
          displayModeBar: false,
          displaylogo: false,
        }}
        layout={{
          width: 320,
          height: graphChartHeight - 20,
          title: 'A Fancy Plot',
          // datarevision: revision,
        }}
        useResizeHandler

        // revision={revision}
        //   useResizeHandler
        //   className={classes.plot}
      />
    </div>
  );
}
