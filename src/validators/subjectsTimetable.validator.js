import { Joi } from "celebrate";

const dayEnum = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const classSchema = Joi.object({
    time: Joi.string()
        .pattern(/^\d{2}:\d{2}-\d{2}:\d{2}$/)
        .required()
        .messages({
            "string.pattern.base": "Time must be in format HH:MM-HH:MM"
        }),
    subject: Joi.string().required(),
    teacher: Joi.string().required()
});

const timetableSchema = Joi.object({
    days: Joi.array()
        .items(
            Joi.object({
                day: Joi.string().valid(...dayEnum).required(),
                periods: Joi.array().items(classSchema).min(1).required()
            })
        )
        .length(dayEnum.length)
        .required(),

    batchId: Joi.string().required()
});

export { timetableSchema };
