require('dotenv').config({ path: '../config/.env' });
const axios = require('axios');
const mongoose = require('mongoose');
const Asset = require('../models/asset');


mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

const API_ENDPOINT = process.env.STAKING_API_ENDPOINT;
const apiKey = process.env.STAKING_API_KEY; 


const priceQuery = `{
  assets(where: {ids: ["5d27aa0de03dd80007d1eb49"]}, limit: 1){
    slug
    metrics(limit:500, 
      where:{
        metricKeys: ["price"], 
        createdAt_gt: "2022-10-01", 
      }, 
      order: {createdAt: desc}
      interval: day
    ) {
      metricKey
  defaultValue
  createdAt
    }
}
}`;

const rewardQuery = `{
  assets(where: {ids: ["5d27aa0de03dd80007d1eb49"]}, limit: 1){
    slug
    metrics(limit:500, 
      where:{
        metricKeys: ["reward_rate"], 
        createdAt_gt: "2022-10-01", 
      }, 
      order: {createdAt: desc}
      interval: day
    ) {
      metricKey
  defaultValue
  createdAt,
    }
}
}`;
    

  const fetchDataFromAPI = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      };

      let dataArray = []

      let query = priceQuery

      const response1 = await axios.post(API_ENDPOINT, { query }, { headers });  
      const metrics1 = response1.data.data.assets[0].metrics
      await metrics1.forEach(metric => dataArray.push({date: metric.createdAt, price: metric.defaultValue}))

      query = rewardQuery

      const response2 = await axios.post(API_ENDPOINT, { query }, { headers });  
      const metrics2 = await response2.data.data.assets[0].metrics

      let newDataArray = dataArray.map(item => {
        let itemIndex = dataArray.indexOf(item)
        let sameDayRewardRate = metrics2.find(metric => metrics2.indexOf(metric) === itemIndex)
        return {
          date: Number(item.date.split('T')[0].replace(/-/g, '')),
          price: item.price,
          stakingApr: sameDayRewardRate.defaultValue
        }
      }
      )


      const asset = new Asset({
        name: "Ethereum",
        ticker: "ETH",
        historicalData: [newDataArray]
    });

    await asset.save();
    console.log(asset.historicalData)

      console.log('Data fetched, transformed, and stored successfully.');
    } catch (error) {
      console.error('Error fetching or storing data:', error);
    }
  };



fetchDataFromAPI();


module.exports = { fetchDataFromAPI};
