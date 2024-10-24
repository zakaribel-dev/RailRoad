const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
    name: { type: String, required: true },
    start_station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
    end_station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
    time_of_departure: { type: Date, required: true }
});

const Train = mongoose.model('Train', trainSchema);
module.exports = Train;
