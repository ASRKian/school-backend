import { Joi } from "celebrate";

export const createExamSchema = Joi.object({
    type: Joi.string().required(),
    batchId: Joi.string().required(),
    subjects: Joi.object()
        .pattern(
            Joi.string(),
            Joi.object({
                date: Joi.date()
                    .required()
                    .messages({
                        "any.required": "Date is required for each subject!"
                    }),
                maxMarks: Joi.number()
                    .required()
                    .messages({
                        "any.required": "Max marks is required for each subject!"
                    })
            })
        )
        .min(1)
        .required()
        .messages({
            "any.required": "Subjects are required!",
            "object.min": "At least one subject is required!"
        })
})

export const getExamsSchema = Joi.object({
    batchId: Joi.string().optional()
})