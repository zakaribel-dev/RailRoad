const Joi = require("joi")

const trainSchema = Joi.object({
  name: Joi.string().required(),
  start_station: Joi.string().required(),
  end_station: Joi.string().required(),
  time_of_departure: Joi.date().required(),
}).options({ allowUnknown: true })

module.exports = { trainSchema }
