const Joi = require('joi');

const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required.',
    'string.empty': 'Email cannot be empty.',
    'string.email': 'Email must be a valid email address.',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required.',
    'string.empty': 'Password cannot be empty.',
  })
});

module.exports = loginUserSchema;