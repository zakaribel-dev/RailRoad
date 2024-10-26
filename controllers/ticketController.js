const Train = require('../models/Train'); // pour recup les stations associé à tel ou tel train (via la ref)
const trainService = require('../services/trainService');
const TicketService = require('../services/ticketService');

class TicketController {
    static async renderTicketForm(req, res) {
        try {
            const trains = await trainService.getAllTrains();
            const loggedIn = req.cookies.jwt ? true : false;

            return res.render('ticketForm', { trains, loggedIn });
        } catch (error) {
            console.error('Erreur lors de l\'affichage du formulaire de réservation:', error.message);
            return res.status(500).send('Erreur serveur');
        }
    }

    static renderValidateTicketForm(req, res) {
        const message = req.query.message;
        return res.render('validateTicketForm', { message });
    }

    static async bookTicket(req, res) {
        try {
            const { trainId } = req.body;

            const train = await Train.findById(trainId).populate('start_station end_station');
            if (!train) {
                throw new Error('Train non trouvé');
            }

            const ticket = await TicketService.bookTicket(req.user.id, trainId);

            const responseMessage = {
                message: `Billet réservé avec succès. Le train partira de ${train.start_station.name} et arrivera à ${train.end_station.name}. N'oubliez pas de le composter avec votre numéro de réservation : ${ticket.id}.`,
                ticket
            };

           if(req.headers.accept.includes('application/json')) {
                return res.status(200).json(responseMessage);
            }

            const loggedIn = req.cookies.jwt ? true : false;
            const user = req.user || null;

            return res.render('validateTicketForm', {
                message: responseMessage.message,
                loggedIn,
                user,
                ticket
            });
        } catch (error) {
            console.error('Erreur lors de la réservation du billet:', error.message);
            return res.status(400).json({ message: error.message });
        }
    }

    static async validateTicket(req, res) {
        try {
            const { ticketId } = req.body;
            await TicketService.validateTicket(ticketId);

            const successMessage = 'Ticket validé avec succès, bon voyage :-)';

           if(req.headers.accept.includes('application/json')) {
                return res.status(200).json({ message: successMessage });
            }

            const loggedIn = req.cookies.jwt ? true : false;
            const user = req.user || null;

            return res.render('validateTicketForm', { message: successMessage, loggedIn, user });
        } catch (error) {
            console.error('Erreur lors de la validation du billet:', error.message);

           if(req.headers.accept.includes('application/json')) {
                return res.status(400).json({ message: error.message });
            }

            const errorMessage = `Erreur lors de la validation du ticket: ${error.message}`;
            return res.redirect(`/?message=${encodeURIComponent(errorMessage)}`);
        }
    }
}

module.exports = TicketController;
