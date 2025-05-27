const Joi = require('joi');

const loginResponseSchema = Joi.object({
    message: Joi.string().required(),
    token: Joi.string().required()
});

module.exports = loginResponseSchema;