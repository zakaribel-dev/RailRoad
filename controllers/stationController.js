const StationService = require('../services/stationService');
const Train = require('../models/Train');


exports.renderCreateStationForm = (req, res) => {
    const loggedIn = req.cookies.jwt ? true : false; 

    return res.render('stationForm', {
        formTitle: 'Créer une nouvelle Station',
        action: '/stations',
        station: null,
        loggedIn 
    });
};


exports.renderEditStationForm = async (req, res) => {
    const { stationId } = req.params;
    const loggedIn = req.cookies.jwt ? true : false; 

    try {
        const station = await StationService.getStationById(stationId);
        if (!station) {
            return res.status(404).json({ message: 'Station introuvable' });
        }

        return res.render('stationForm', {
            formTitle: 'Modifier la Station',
            action: `/stations/${stationId}?_method=PUT`,
            station,
            loggedIn 
        });
    } catch (error) {
        return res.status(500).send('Erreur serveur');
    }
};


exports.createStation = async (req, res) => {
    try {
        const { name, open_hour, close_hour } = req.body;

        const newStationData = {
            name,
            open_hour,
            close_hour,
            image: req.file ? req.file.filename : null 
        };

        const newStation = await StationService.createStation(newStationData);

        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(200).json({ 
                message: "Nouvelle station créée avec succès." + (req.file ? " L'image a été redimensionnée à 200x200 pixels." : ""),
                newStation 
            });
        }

        return res.redirect("/stations?message=Nouvelle station créée avec succès." + (req.file ? " L'image a été redimensionnée à 200x200 pixels." : ""));
    } catch (error) {
        console.error('Erreur lors de la création de la station:', error.message);
        return res.status(400).json({ message: error.message });
    }
};

exports.getAllStations = async (req, res) => {
    try {
        const { sortBy = 'name', limit = 10 } = req.query;
        const stations = await StationService.getAllStations(sortBy, limit);

        const user = req.user || null;
        const loggedIn = !!req.user;  

        const message = req.query.message || null;

        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.json({ stations });
        } else {
            return res.render('stations', {
                stations,
                user,
                loggedIn,  
                message
            });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des stations:', error.message);

        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(500).json({ message: 'Erreur serveur', error: error.message });
        } else {
            return res.status(500).send('Erreur serveur');
        }
    }
};



exports.getStationById = async (req, res) => {
    const { stationId } = req.params;
    try {
        const station = await StationService.getStationById(stationId);
        if (!station) {
            return res.status(404).json({ message: 'Station non trouvée' });
        }
        return res.status(200).json({station});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.updateStation = async (req, res) => {
    const { stationId } = req.params;

    try {
//je cherche à recuperer la station actuelle pour pouvoir renvoyer l'image actuelle si l'user n'envoie pas de nouvelle image
//pareil pour le reste
        const existingStation = await StationService.getStationById(stationId);

        if (!existingStation) {
            return res.status(404).json({ message: 'Station non trouvée, tu t\'es trompé d\'ID non ?' });
        }

        const updatedData = { 
            name: req.body.name || existingStation.name,
            open_hour: req.body.open_hour || existingStation.open_hour,
            close_hour: req.body.close_hour || existingStation.close_hour,
            image: req.file ? req.file.filename : existingStation.image
        };

        const updatedStation = await StationService.updateStation(stationId, updatedData);

        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(200).json({ message: 'Station bien modifiée', updatedStation });
        }

        return res.redirect('/stations?message=Station%20bien%20modifiée');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la station:', error.message);
        return res.status(400).json({ message: error.message });
    }
};


exports.deleteStation = async (req, res) => {
    const { stationId } = req.params; 
    try {

        const isStationLinked = await Train.findOne({
            $or: [{ start_station: stationId }, { end_station: stationId }]
        });

        if (isStationLinked) {
            return res.status(400).json({ message: 'Cette station est liée à un ou plusieurs trains ou tickets et ne peut pas être supprimée.' });
        }

        await StationService.deleteStation(stationId);

        if (req.headers.accept && req.headers.accept.includes('application/json')) { 
            return res.status(200).json({ message: 'Station supprimée avec succès' });
        }

        return res.redirect('/stations?message=Station%20supprimée%20avec%20succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la station:', error.message);
        return res.status(400).json({ message: error.message });
    }
};
