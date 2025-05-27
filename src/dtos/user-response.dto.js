const Joi = require('joi');

const userResponseSchema = Joi.object({
    id: Joi.number().integer().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('USER', 'ADMIN').required(),
    createdAt: Joi.date().iso().required()
});

module.exports = userResponseSchema;