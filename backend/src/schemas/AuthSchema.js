import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).required(),
  confirm_password: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password must match password",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().optional().allow(""),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).required(),
});
