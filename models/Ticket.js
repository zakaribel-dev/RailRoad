const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true },
    isValid: { type: Boolean, default: false },
    bookedAt: { type: Date, default: Date.now },
});

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;
