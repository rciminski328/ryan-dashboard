export const humidityAndTempLabels = [
  { field: "max", label: "Max", format: (val: number) => val.toFixed(1) },
  { field: "min", label: "Min", format: (val: number) => val.toFixed(1) },
  {
    field: "average",
    label: "Average",
    format: (val: number) => val.toFixed(2),
  },
  { field: "median", label: "Median", format: (val: number) => val.toFixed(2) },
  {
    field: "stdDev",
    label: "Std Dev",
    format: (val: number) => val.toFixed(1),
  },
];

export const smallGaugeChartHeight = 200;
export const smallGaugeChartWidth = 250;
