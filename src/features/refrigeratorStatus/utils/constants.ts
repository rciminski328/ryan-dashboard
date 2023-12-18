export const humidityAndTempLabels = [
  { field: 'max', label: 'Max', format: (val) => val.toFixed(1) },
  { field: 'min', label: 'Min', format: (val) => val.toFixed(1) },
  { field: 'average', label: 'Average', format: (val) => val.toFixed(2) },
  { field: 'median', label: 'Median', format: (val) => val.toFixed(2) },
  { field: 'stdDev', label: 'Std Dev', format: (val) => val.toFixed(1) },
];
