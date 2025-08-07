import { Joi } from "celebrate";

export const idParamSchema = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
});


export const batchSchema = Joi.object({
    standard: Joi.string().required(),
    year: Joi.string().required().regex(/^\d{4}-\d{2}$/, "year").messages({
        "string.pattern.name": "Year must be in the format YYYY-YY (e.g., 2008-09)"
    }),
    subjects: Joi.array().items(Joi.string()).required(),
    section: Joi.string().optional()
})

export const batchPatchSchema = batchSchema.fork(
    ["standard", "year", "subjects"],
    (field) => field.optional()
);