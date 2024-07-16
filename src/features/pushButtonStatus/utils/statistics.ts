export const getStatistics = (data: number[]) => {
    const n = data.length;
    if (n === 0) {
      return {
        min: 0,
        max: 0,
        average: 0,
        median: 0,
        stdDev: 0,
      };
    }
  
    const sortedData = [...data].sort((a, b) => a - b);
    const min = sortedData[0];
    const max = sortedData[n - 1];
    const average = data.reduce((a, b) => a + b, 0) / n;
    const median =
      n % 2 === 0
        ? (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2
        : sortedData[(n - 1) / 2];
    const stdDev = Math.sqrt(
      data.map((x) => Math.pow(x - average, 2)).reduce((a, b) => a + b) / n
    );
  
    return {
      min,
      max,
      average,
      median,
      stdDev,
    };
  };
  