const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    open_hour: { type: String, required: true },
    close_hour: { type: String, required: true },
    image: { type: String, required: false }
});

const Station = mongoose.model('Station', stationSchema); 

module.exports = Station;
