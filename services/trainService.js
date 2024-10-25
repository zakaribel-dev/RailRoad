const TrainDAO = require('../dao/trainDAO'); 

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

    static async getTrainsByFilter(query, limit, sortCondition) {
        let filter = {};
        if (query.start_station) filter.start_station = query.start_station;
        if (query.end_station) filter.end_station = query.end_station;

        let sort = {};
        if (sortCondition === 'time_of_departure') {
            sort.time_of_departure = 1; // Tri croissant (ou -1 pour décroissant) 
            //  https://www.mongodbtutorial.org/mongodb-crud/mongodb-sort/
        }

        return await TrainDAO.findTrains(filter, limit, sort);
    }
}

module.exports = TrainService;
