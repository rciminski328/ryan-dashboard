export function getStats(data: number[]) {
  const n = data.length;
  const sortedData = data.slice().sort((a, b) => a - b);
  const min = sortedData[0];
  const max = sortedData[n - 1];
  const sum = sortedData.reduce((acc, val) => acc + val, 0);
  const average = sum / n;
  const median = (sortedData[(n - 1) >> 1] + sortedData[n >> 1]) / 2;
  const variance = sortedData.reduce((acc, val) => acc + (val - average) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);

  return {
    count: n,
    min,
    max,
    average,
    median,
    stdDev,
  };
}
