const Joi = require('joi');

const categoryResponseSchema = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().required()
});

module.exports = categoryResponseSchema;