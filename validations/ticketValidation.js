const Joi = require('joi');

const ticketSchema = Joi.object({
    train: Joi.string().required(),
    start_station: Joi.string().required(),
    end_station: Joi.string().required(),
}).options({ allowUnknown: true }); 
module.exports = { ticketSchema };
