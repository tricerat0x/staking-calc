    const calculateMean = (x) => {
      let mean = x.reduce((acc, val) => acc + val, 0) / x.length;
      return mean;
    }
  
    const calculateVariance = (x) => {
      let mean = calculateMean(x); 
      const variance = x.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / x.length;
      return variance;
    }
  
    const calculateCovariance = (x, y) => {
      const xMean = calculateMean(x);
      const yMean = calculateMean(y);
      return x.reduce((acc, val, idx) => acc + (val - xMean) * (y[idx] - yMean), 0) / x.length;
    }
  
    const calculateStandardDeviation = (x) => {
      const variance = calculateVariance(x); 
      return Math.sqrt(variance); 
    }
  
    const calculateBeta = (x, y) => {
      const varianceX = calculateVariance(x);
      const covarianceXY = calculateCovariance(x, y); 
      return covarianceXY / varianceX; 
    }
  
    const calculateSharpeRatio = (x, y) => {
      const meanX = calculateMean(x);
      const sdX = calculateStandardDeviation(x); 
      return (meanX - y) / sdX; 
    }
  
    const calculateSortinoRatio = (x, y) => {
      const downsideReturns = x.filter(r => r < y);
      const downsideDeviation = calculateStandardDeviation(downsideReturns); 
      const meanReturn = calculateMean(x);
      return (meanReturn - y) / downsideDeviation;
    }

    module.exports = {calculateMean, calculateVariance, calculateCovariance, calculateBeta, calculateSharpeRatio, calculateSortinoRatio}

