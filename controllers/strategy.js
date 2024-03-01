require('dotenv').config({ path: '../config/.env' });
const mongoose = require('mongoose');
const Asset = require('../models/asset.js');
const { deltaDrift, hedgingCosts } = require('../models/inputs.js');


const  connectToDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Could not connect to MongoDB:', error);
    }
}

async function calcStrategyPerf(req){
await connectToDB()
const asset = await Asset.findById("65e09645ddcd94faf428e4df");
const {name, ticker} = asset
const historicalData = asset.historicalData[0]
const request = req.body
const { startDate, endDate, isHedged } = request;
console.log("REQUEST BODY:", startDate, endDate, isHedged)

const fetchDataArray = async(x, y) =>{
    let startDate = x
    let endDate = y
    const startIndex =  await historicalData.findIndex(item => item.date === Number(startDate.replace(/-/g, '')))
    const endIndex =  await historicalData.findIndex(item => item.date === Number(endDate.replace(/-/g, '')))
    return await historicalData.slice(endIndex, startIndex)

}

const fetchSpotPrice = async (date) => {
    const dailyPerfData = historicalData.find(data => data.date === Number(date.replace(/-/g, '')))
    return spotPrice = dailyPerfData.price
}
const fetchStakingApr = async (x) => {
    const dataArray = x
    const avgStakingApr = await dataArray.reduce((acc, val) => acc + val.stakingApr, 0) / dataArray.length
    console.log("DEBUGGER", avgStakingApr)
    return avgStakingApr

}

let startPrice = await fetchSpotPrice(startDate)
let endPrice =  await fetchSpotPrice(endDate)
console.log("START & END PRICE", startPrice, endPrice)


const spotDelta = (1/startPrice) * endPrice 
const dataArray = await fetchDataArray(startDate, endDate)
const stakingApr = await fetchStakingApr(dataArray) * spotDelta
const spotApr = (spotDelta - 1) * 100
console.log("RAW STAKING APR", await fetchStakingApr(dataArray))


let totalReturn;
if (isHedged === 'true') {
  totalReturn = (spotApr * deltaDrift) + stakingApr - hedgingCosts;
} else {
  totalReturn = spotApr + stakingApr;
}
dataArray.push(await totalReturn)
let i = dataArray.length - 1
let lastItem = dataArray[i]
console.log("DEBUGGER HEDGING BOOL", isHedged, deltaDrift, spotApr, stakingApr, totalReturn, lastItem)
return(dataArray)
};


const totalReturnCalc = async (req, res) => {
    if (req.method === 'POST') {
        let dataArray = await calcStrategyPerf(req); 
        const totalReturn = dataArray.pop()
        console.log("DEBUGGER TEST DATA ARRAY", dataArray)
        let isUserAuthenticated = req.isAuthenticated();
        res.render('index', { title: "Staking Total Returns Calculator", results: totalReturn, dataArray: dataArray, isUserAuthenticated: isUserAuthenticated });
        return totalReturn
    } 
  };


  module.exports = {totalReturnCalc}

