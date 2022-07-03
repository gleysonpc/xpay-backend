import Joi from 'joi';

export const CreateBalance = Joi.object().keys({
    description: Joi.string().required(),
});
