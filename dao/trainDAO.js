const Train = require("../models/Train") 

class TrainDAO {
  static async getAllTrains(limit) {
    return await Train.find()
      .limit(limit)
      .populate("start_station")
      .populate("end_station")
  }

  static async findTrainById(trainId) {
    return await Train.findById(trainId)
      .populate("start_station")
      .populate("end_station")
  }

  static async createTrain(trainData) {
    return await Train.create(trainData)
  }

  static async updateTrain(trainId, updateData) {
    return await Train.findByIdAndUpdate(trainId, updateData, { new: true })
  }

  static async deleteTrain(trainId) {
    return await Train.findByIdAndDelete(trainId)
  }

  
  static async findTrains(filterCondition, limit, sortCondition) {
    return await Train.find(filterCondition)
        .populate("start_station")
        .populate("end_station")
        .sort(sortCondition)
        .limit(limit);
}

  static async getTrainsByFilter(query, limit, sortCondition) {
    return await TrainDAO.findTrains(query, limit, sortCondition);
}

}

module.exports = TrainDAO
