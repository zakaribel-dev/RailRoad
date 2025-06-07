const TrainService = require('../services/trainService');
const Station = require('../models/Station');
const Train = require('../models/Train');

class TrainController {
    // Renders ..
    static async renderCreateTrainForm(req, res, next) {
        try {
            const loggedIn = req.cookies.jwt ? true : false;

            const stations = await Station.find();
            return res.render('trainForm', {
                formTitle: 'Créer un nouveau Train',
                action: '/trains',
                train: null,
                stations,
                loggedIn
            });
        } catch (error) {
            return next(error);
        }
    }

    static async renderEditTrainForm(req, res, next) {
        const { trainId } = req.params;
        try {
            const loggedIn = req.cookies.jwt ? true : false;

            const train = await TrainService.getTrainById(trainId);

            const stations = await Station.find();
            return res.render('trainForm', {
                formTitle: 'Modifier le Train',
                action: `/trains/${trainId}?_method=PUT`,
                train,
                stations,
                loggedIn
            });
        } catch (error) {
            return next(error);
        }
    }

    static async getIndexPage(req, res, next) {
        try {
            const trains = await TrainService.getAllTrains(10);

            const loggedIn = req.cookies.jwt ? true : false;
            // je n'applique pas authMiddleware à ma page principale car je veux qu'elle soit accessible meme en étant pas connecté.
            // alors du coup je requipere le token via le cookie qui est généré uniquement si on se connecte manuellement (via la vue login)

            const message = req.query.message || null;
            const error = req.query.error || null;

            return res.render('index', { trains, loggedIn, message, error });
        } catch (error) {
            return next(error);
        }
    }

    // FIN Renders ..

    // CRUD..

    static async getAllTrains(req, res, next) {
        try {
            const { start_station, end_station, sortBy } = req.query;
            const limit = parseInt(req.query.limit);

            const trains = await TrainService.getTrainsByFilter({ start_station, end_station }, limit, sortBy);
            const error = req.query.error || null;

            return res.status(200).json({ trains, error });
        } catch (error) {
            return next(error);
        }
    }

    static async createTrain(req, res, next) {
        try {
            const { name, start_station, end_station, time_of_departure } = req.body;

            await TrainService.createTrain({
                name,
                start_station,
                end_station,
                time_of_departure
            });

            if (req.headers.accept.includes('application/json')) { // Pour Postman
                return res.status(200).json({ message: 'Train bien ajouté.' });
            }

            res.redirect('/trains?message=nouveau%20train%20ajouté');
        } catch (error) {
            return next(error);
        }
    }

    static async getTrainById(req, res, next) {
        const { trainId } = req.params;
        try {
            const train = await TrainService.getTrainById(trainId);
            return res.status(200).json({ train });
        } catch (error) {
            return next(error);
        }
    }

    static async handleTrains(req, res, next) {
        try {
            const { start_station, end_station, sortBy } = req.query;
            const limit = req.query.limit;

            const trains = await TrainService.getTrainsForFrontend({ start_station, end_station, sortBy, limit });
            const stations = await Station.find();

            const user = req.user;
            const loggedIn = user ? true : false;
            const error = req.query.error || null;

            return res.render('trains', {
                trains,
                stations,
                loggedIn,
                user,
                selectedStartStation: start_station,
                selectedEndStation: end_station,
                sortBy,
                message: req.query.message || null,
                error
            });
        } catch (error) {
            return next(error);
        }
    }

    static async updateTrain(req, res, next) {
        const { trainId } = req.params;
        try {
            const { name, start_station, end_station, time_of_departure } = req.body;

            const updatedTrain = await TrainService.updateTrain(trainId, {
                name,
                start_station,
                end_station,
                time_of_departure
            });

            if (req.headers.accept.includes('application/json')) {
                return res.status(200).json({ message: 'Train bien modifié', updatedTrain });
            }

            res.redirect('/trains?message=train%20modifié');
        } catch (error) {
            return next(error);
        }
    }

    static async deleteTrain(req, res, next) {
        const { trainId } = req.params;
        try {
            const deletedTrain = await TrainService.deleteTrain(trainId);

            if (req.headers.accept.includes('application/json')) {
                return res.status(200).json({ message: 'Train bien supprimé', deletedTrain });
            }

            return res.redirect('/trains?message=Train%20supprimé%20avec%20succès');
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = TrainController;
