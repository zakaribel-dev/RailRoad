const StationDAO = require('../dao/stationDAO');
const { ERRORS } = require('../utils/errors');

class StationService {
  static async createStation(stationData) {
    return await StationDAO.createStation(stationData);
  }

  static async getAllStations(sortBy = 'name', limit = 10) {
    return await StationDAO.getAllStations(sortBy, limit);
  }

  static async getStationById(stationId) {
    const station = await StationDAO.getStationById(stationId);
    if (!station) {
      const err = { ...ERRORS.STATION_NOT_FOUND, status: 404 };
      throw err;
    }
    return station;
  }

  static async updateStation(stationId, updateData) {
    return await StationDAO.updateStation(stationId, updateData);
  }

  static async deleteStation(stationId) {
    return await StationDAO.deleteStation(stationId);
  }
}

module.exports = StationService;
