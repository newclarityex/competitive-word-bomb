const Joi = require("joi");

const authSchema = Joi.object({
    username: Joi.string().max(32).required().invalid("Guest").regex(/^\S*$/),
    password: Joi.string().min(8).max(2048).required(),
    email: Joi.string().email(),
});

module.exports = authSchema;
