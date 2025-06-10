const Train = require("../models/Train"); // pour recup les stations associé à tel ou tel train (via la ref)
const trainService = require("../services/trainService");
const TicketService = require("../services/ticketService");
const { ERRORS } = require("../utils/errors");

class TicketController {
  static async renderTicketForm(req, res, next) {
    try {
      const trains = await trainService.getAllTrains();
      const loggedIn = req.cookies.jwt ? true : false;
      const error = req.query.error || null;

      return res.render("ticketForm", { trains, loggedIn, error });
    } catch (error) {
      return next(error);
    }
  }

  static renderValidateTicketForm(req, res) {
    const message = req.query.message;
    const error = req.query.error || null;
    return res.render("validateTicketForm", { message, error });
  }

  static async bookTicket(req, res, next) {
    try {
      const { trainId } = req.body;

      const train = await Train.findById(trainId).populate(
        "start_station end_station"
      );
      if (!train) {
        throw { ...ERRORS.TRAIN_NOT_FOUND, status: 404 };
      }

      const ticket = await TicketService.bookTicket(req.user.id, trainId);

      const responseMessage = `Billet réservé avec succès. Le train partira de ${train.start_station.name} et arrivera à ${train.end_station.name}. N'oubliez pas de le composter avec votre numéro de réservation : ${ticket.id}.`;

      if (req.headers.accept.includes("application/json")) {
        return res.status(200).json({ message: responseMessage, ticket });
      }
      const loggedIn = req.cookies.jwt ? true : false;
      const user = req.user || null;
      const error = req.query.error || null;

      return res.render("validateTicketForm", {
        message: responseMessage,
        loggedIn,
        user,
        ticket,
        error,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async validateTicket(req, res, next) {
    try {
      const { ticketId } = req.body;
      await TicketService.validateTicket(ticketId);

      const message = "Ticket validé avec succès, bon voyage :-)";

      if (req.headers.accept.includes("application/json")) {
        return res.status(200).json({ message });
      }

      const loggedIn = req.cookies.jwt ? true : false;
      const user = req.user;
      const error = req.query.error || null;

      return res.render("validateTicketForm", {
        message,
        loggedIn,
        user,
        error,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = TicketController;
