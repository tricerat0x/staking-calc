const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const assetSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ticker: {
        type: String, 
        required: true
    },
    historicalData: []
});


module.exports = mongoose.model('Asset', assetSchema);