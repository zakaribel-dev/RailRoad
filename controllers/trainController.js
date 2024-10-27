const TrainService = require('../services/trainService');
const Station = require('../models/Station');
const Train = require('../models/Train');

class TrainController {
    // Renders ..
    static async renderCreateTrainForm(req, res) {
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
            console.error('Erreur:', error);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    static async renderEditTrainForm(req, res) {
        const { trainId } = req.params;
        try {
            const loggedIn = req.cookies.jwt ? true : false;

            const train = await TrainService.getTrainById(trainId);
            if (!train) {
                return res.status(404).json({ message: "Train non trouvé." });
            }

            const stations = await Station.find();
            return res.render('trainForm', {
                formTitle: 'Modifier le Train',
                action: `/trains/${trainId}?_method=PUT`,
                train,
                stations,
                loggedIn
            });
        } catch (error) {
            return res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    static async getIndexPage(req, res) {
        try {
        
            const trains = await TrainService.getAllTrains(10);
        
            const loggedIn = req.cookies.jwt ? true : false;
            // je n'applique pas authMiddleware à ma page principale car je veux qu'elle soit accessible meme en étant pas connecté.
            // alors du coup je requipere le token via le cookie qui est généré uniquement si on se connecte manuellement (via la vue login)

            const message = req.query.message || null; // message dans l'url ou null

            return res.render('index', { trains, loggedIn, message });
        } catch (error) {
            console.error('Erreur lors de la récupération des trains:', error.message);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    // FIN Renders ..

    // CRUD..

    
    static async getAllTrains(req, res) {
        try {
            const { start_station, end_station, sortBy } = req.query;
            const limit = parseInt(req.query.limit)

            const trains = await TrainService.getTrainsByFilter({ start_station, end_station }, limit, sortBy);

            return res.status(200).json({ trains });
        } catch (error) {
            console.error('Erreur lors de la récupération des trains:', error.message);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    static async createTrain(req, res) {
        try {
            const { name, start_station, end_station, time_of_departure } = req.body;

            await TrainService.createTrain({
                name,
                start_station,
                end_station,
                time_of_departure
            });

           if(req.headers.accept.includes('application/json')) { // Pour Postman
                return res.status(200).json({ message: 'Train bien ajouté.' });
            }

            res.redirect('/trains?message=nouveau%20train%20ajouté');
        } catch (error) {
            console.error('Erreur:', error.message);
            return res.status(400).json({ message: error.message });
        }
    }

    static async getTrainById(req, res) {
        const { trainId } = req.params;
        try {
            const train = await TrainService.getTrainById(trainId);
            if (!train) {
                return res.status(404).json({ message: "Train non trouvé." });
            }
            return res.status(200).json({ train });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async handleTrains(req, res) {
        try {
            const { start_station, end_station, sortBy } = req.query;
            const limit = req.query.params
    
            const trains = await TrainService.getTrainsForFrontend({ start_station, end_station, sortBy, limit });
            const stations = await Station.find();
    
            const user = req.user;
            const loggedIn = user ? true : false;
    
            return res.render('trains', {
                trains,
                stations,
                loggedIn,
                user,
                selectedStartStation: start_station,
                selectedEndStation: end_station,
                sortBy,
                message: req.query.message || null
            });
        } catch (error) {
            console.error('Erreur lors du rendu des trains:', error.message);
            return res.status(500).json({ message: error.message });
        }
    }
    
    
    
    static async updateTrain(req, res) {
        const { trainId } = req.params;
        try {
            const { name, start_station, end_station, time_of_departure } = req.body;

            const updatedTrain = await TrainService.updateTrain(trainId, {
                name,
                start_station,
                end_station,
                time_of_departure
            });

           if(req.headers.accept.includes('application/json')) {
                return res.status(200).json({ message: 'Train bien modifié', updatedTrain });
            }

            res.redirect('/trains?message=train%20modifié');
        } catch (error) {
            console.error('Erreur lors de la modification du train:', error.message);
            return res.status(400).json({ message: error.message });
        }
    }

    static async deleteTrain(req, res) {
        const { trainId } = req.params;
        try {
            const deletedTrain = await TrainService.deleteTrain(trainId);

           if(req.headers.accept.includes('application/json')) {
                return res.status(200).json({ message: 'Train bien supprimé', deletedTrain });
            }

            return res.redirect('/trains?message=Train%20supprimé%20avec%20succès');
        } catch (error) {
            console.error(error.message);
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = TrainController;
