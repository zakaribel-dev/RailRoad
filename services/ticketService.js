const TicketDAO = require("../dao/ticketDAO");
const { ERRORS } = require("../utils/errors");

class TicketService {
  static async bookTicket(userId, trainId) {
    const ticketData = {
      userId: userId,
      trainId: trainId,
      isValid: false,
    };
    return await TicketDAO.createTicket(ticketData);
  }

  static async validateTicket(ticketId) {
    const updateData = { isValid: true };
    const updatedTicket = await TicketDAO.validateTicket(ticketId, updateData);

    if (!updatedTicket) {
      throw ERRORS.TICKET_VALIDATION_FAILED
    }

    return updatedTicket;
  }
}

module.exports = TicketService;
