const Station = require('../models/Station');

class StationDAO {
    static async createStation(stationData) {
        const station = new Station(stationData);
        return await station.save();
    }

    static async getAllStations(sortBy, limit) {
        return await Station.find()
            .sort({ [sortBy]: 1 })  
            .limit(parseInt(limit));
    }
    
    
    static async getStationById(stationId) {
        return await Station.findById(stationId);
    }

    static async updateStation(stationId, updateData) {
        return await Station.findByIdAndUpdate(stationId, updateData);
    }

    static async deleteStation(stationId) {
        return await Station.findByIdAndDelete(stationId);
    }
}

module.exports = StationDAO;
