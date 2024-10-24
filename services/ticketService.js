const TicketDAO = require('../dao/ticketDAO');

class TicketService {

    static async bookTicket(userId, trainId) {
        const ticketData = {
            userId: userId,
            trainId: trainId,
            isValid: false 
        };
        return await TicketDAO.createTicket(ticketData);
    }

    static async validateTicket(ticketId) {
 
        const updateData = { isValid: true };
        return await TicketDAO.validateTicket(ticketId, updateData);
    }
}

module.exports = TicketService;
