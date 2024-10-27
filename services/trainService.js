const TrainDAO = require("../dao/trainDAO");
const Station = require('../models/Station');

class TrainService {
  static async getAllTrains(limit) {
    return await TrainDAO.getAllTrains(limit);
  }

  static async getTrainById(trainId) {
    return await TrainDAO.findTrainById(trainId);
  }

  static async createTrain(trainData) {
    return await TrainDAO.createTrain(trainData);
  }

  static async updateTrain(trainId, updateData) {
    return await TrainDAO.updateTrain(trainId, updateData);
  }

  static async deleteTrain(trainId) {
    return await TrainDAO.deleteTrain(trainId);
  }

 static async  getStationId(stationName) {  // je fais cette methode pour alleger un peu getTrainsByFilter..
    const station = await Station.findOne({ name: stationName });
    if(station){
      return station._id
    }
}

static async getTrainsByFilter(query, limit = 15, sortCondition) {
  try {
      let filterCondition = {};  // la methode find de mongoose attend un objet si on filtre par station de départ alors
      // ça ressemblerait à un truc comme {start_station : id de la station}
      let sort = {};  // pareil ici ça ressemblerait à {time_of_departure : 1} 

      const startStationId = await this.getStationId(query.start_station); // je recupere l'id de la station car c'est necessaire étant donné la ref à station dans trains
      const endStationId = await this.getStationId(query.end_station);

      if (startStationId) {
          filterCondition.start_station = startStationId;
      } else if (endStationId) {
          filterCondition.end_station = endStationId;
      }

      if (sortCondition === "time_of_departure") {
          sort.time_of_departure = 1; // Tri croissant (ou -1 pour décroissant) 
          //  https://www.mongodbtutorial.org/mongodb-crud/mongodb-sort/
      } else if (sortCondition === "start_station") {
          sort.start_station = 1;
      } else if (sortCondition === "end_station") {
          sort.end_station = 1;
      } 

      limit = parseInt(limit);

      return await TrainDAO.findTrains(filterCondition, limit, sort);
  } catch (error) {
      throw new Error("Erreur lors de la récupération des trains: " + error.message);
  }
}

  
  static async getTrainsForFrontend({ start_station, end_station, sortBy, limit }) {
    try {
        const trains = await this.getTrainsByFilter({ start_station, end_station }, limit, sortBy);

        return trains;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des trains pour le frontend: ' + error.message);
    }
}

}
 

module.exports = TrainService;
