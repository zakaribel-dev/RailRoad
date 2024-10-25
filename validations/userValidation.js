const Joi = require('joi');


// pk deux schémas pour userValidation ?
//Parce qu'il faut absolument que certains champs soient required quand je me register sauf role qui a une default value
//Lorsque j'update je peux ne vouloir qu'update qu'un field donc un deuxieme schema sans que les fields soient required
const userCreateSchema = Joi.object({   
    email: Joi.string().email().required(),
    pseudo: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('user', 'admin','employee').default('user'),
});

const userUpdateSchema = Joi.object({
    email: Joi.string().email(),
    pseudo: Joi.string().min(3).max(30),
    password: Joi.string().min(8),
    role: Joi.string().valid('user', 'admin', "employee"),
}).min(1);

module.exports = {
    userCreateSchema,
    userUpdateSchema,
};
