import Joi from 'joi';

export const SignUpSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
});

export const LoginUpSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
});
