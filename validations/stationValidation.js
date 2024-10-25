const Joi = require('joi');

const stationSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    open_hour: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
    close_hour: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
    image: Joi.string().optional()
}).options({ allowUnknown: true }); //Permet d'ignorer les champs non définis dans le schéma comme _method 
//(important pour mes form ejs)

module.exports = { stationSchema };
