const mongoose = require('mongoose');
const {riskFreeRate, excessBenchmarkReturns} = require('../models/inputs.js')
const calculator = require('./calculator.js')
const {calculateVariance,
    calculateCovariance,
    calculateStandardDeviation,
    calculateBeta,
    calculateSharpeRatio,
    calculateSortinoRatio} = calculator

const calcMetrics = async (x) => {
    const totalReturns = await x
    const excessTotalReturns = totalReturns - riskFreeRate
    //const excessBenchmarkReturns = benchmarkReturns.map(r => r - riskFreeRate)
    
    const variance = calculateVariance(totalReturns)
    const covariance = calculateCovariance(excessTotalReturns, excessBenchmarkReturns);
    const standardDeviation = calculateStandardDeviation(variance);
    const beta = calculateBeta(excessBenchmarkReturns, covariance);
    const sharpeRatio = calculateSharpeRatio(excessTotalReturns, standardDeviation);
    const sortinoRatio = calculateSortinoRatio(excessTotalReturns, riskFreeRate)
    
    console.log(`Variance: ${variance.toFixed(2)}%`)
    console.log(`Covariance: ${covariance.toFixed(2)}%`)
    console.log(`Standard Deviation: ${standardDeviation.toFixed(2)}%`)
    console.log(`Beta: ${beta.toFixed(2)}`);
    console.log(`Sharpe Ratio: ${sharpeRatio.toFixed(2)}`);
    console.log(`Sortino Ratio: ${sortinoRatio.toFixed(2)}`);
  
    
    return{standardDeviation, beta, sharpeRatio, sortinoRatio}
     }

module.exports = {calcMetrics}
