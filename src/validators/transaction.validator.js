import { Joi } from "celebrate";

export const transactionUpdateSchema = Joi.object({
    trxId: Joi.string().required(),
    status: Joi.string().valid('SUCCESS', 'FAILED').required(),
    bankRrn: Joi.string().when('status', {
        is: 'SUCCESS',
        then: Joi.required(),
        otherwise: Joi.forbidden()
    })
});

export const transactionQuerySchema = Joi.object({
    status: Joi.string().valid('PENDING', 'SUCCESS', 'FAILED'),
    trxId: Joi.string()
}).optional();