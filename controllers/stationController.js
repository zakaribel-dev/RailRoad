const StationService = require('../services/stationService');
const Train = require('../models/Train');
const { ERRORS } = require('../utils/errors');

class StationController {
  static renderCreateStationForm(req, res) {
    const loggedIn = req.cookies.jwt ? true : false;

    return res.render('stationForm', {
      formTitle: 'Créer une nouvelle Station',
      action: '/stations',
      station: null,
      loggedIn
    });
  }

  static async renderEditStationForm(req, res, next) {
    const { stationId } = req.params;
    const loggedIn = req.cookies.jwt ? true : false;

    try {
      const station = await StationService.getStationById(stationId);

      return res.render('stationForm', {
        formTitle: 'Modifier la Station',
        action: `/stations/${stationId}?_method=PUT`,
        station,
        loggedIn
      });
    } catch (error) {
      return next(error);
    }
  }

  static async createStation(req, res, next) {
    try {
      const { name, open_hour, close_hour } = req.body;

      const newStationData = {
        name,
        open_hour,
        close_hour,
        image: req.file ? req.file.filename : null
      };

      const newStation = await StationService.createStation(newStationData);

      const successMessage = "Nouvelle station créée avec succès." + (req.file ? " L'image a été redimensionnée à 200x200 pixels." : "");

      if (req.headers.accept.includes('application/json')) {
        return res.status(200).json({ message: successMessage, newStation });
      }

      return res.redirect("/stations?message=" + encodeURIComponent(successMessage));
    } catch (error) {
      return next(error);
    }
  }

  static async getAllStations(req, res, next) {
    try {
      const { sortBy = 'name', limit = 10 } = req.query;
      const stations = await StationService.getAllStations(sortBy, limit);

      const user = req.user || null;
      const loggedIn = !!req.user;
      const message = req.query.message || null;
      const error = req.query.error || null;

      if (req.headers.accept.includes('application/json')) {
        return res.json({ stations });
      }

      return res.render('stations', {
        stations,
        user,
        loggedIn,
        message,
        error
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getStationById(req, res, next) {
    try {
      const { stationId } = req.params;
      const station = await StationService.getStationById(stationId);
      return res.status(200).json({ station });
    } catch (error) {
      return next(error);
    }
  }

  static async updateStation(req, res, next) {
    try {
      const { stationId } = req.params;

      const existingStation = await StationService.getStationById(stationId);

      const updatedData = {
        name: req.body.name || existingStation.name,
        open_hour: req.body.open_hour || existingStation.open_hour,
        close_hour: req.body.close_hour || existingStation.close_hour,
        image: req.file ? req.file.filename : existingStation.image
      };

      const updatedStation = await StationService.updateStation(stationId, updatedData);

      if (req.headers.accept.includes('application/json')) {
        return res.status(200).json({ message: 'Station bien modifiée', updatedStation });
      }

      return res.redirect('/stations?message=Station%20bien%20modifiée');
    } catch (error) {
      return next(error);
    }
  }

  static async deleteStation(req, res, next) {
    try {
      const { stationId } = req.params;

      const isStationLinked = await Train.findOne({
        $or: [{ start_station: stationId }, { end_station: stationId }]
      });

      if (isStationLinked) {
        throw ERRORS.STATION_LINKED_TO_TRAIN
      }

      await StationService.deleteStation(stationId);

      if (req.headers.accept.includes('application/json')) {
        return res.status(200).json({ message: 'Station supprimée avec succès' });
      }

      return res.redirect('/stations?message=Station%20supprimée%20avec%20succès');
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = StationController;
