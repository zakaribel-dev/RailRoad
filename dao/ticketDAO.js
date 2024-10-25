const Ticket = require('../models/Ticket');

class TicketDAO {
    
    static async createTicket(ticketData) {
        const ticket = new Ticket(ticketData);
        return await ticket.save();
    }

    static async validateTicket(ticketId, updateData) {
        return await Ticket.findByIdAndUpdate(ticketId, updateData);
    }

}

module.exports = TicketDAO;
