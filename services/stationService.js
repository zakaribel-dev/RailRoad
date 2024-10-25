const StationDAO = require('../dao/stationDAO');

class StationService {
    static async createStation(stationData) {
        return await StationDAO.createStation(stationData);
    }
    static async getAllStations(sortBy = 'name', limit = 10) {
        return await StationDAO.getAllStations(sortBy, limit);
    }
    
    
    static async getStationById(stationId) {
        return await StationDAO.getStationById(stationId);
    }

    static async updateStation(stationId, updateData) {
        return await StationDAO.updateStation(stationId, updateData);
    }

    static async deleteStation(stationId) {
        return await StationDAO.deleteStation(stationId);
    }
}

module.exports = StationService;
