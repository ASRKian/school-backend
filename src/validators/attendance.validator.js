import { Joi } from "celebrate";

export const addAttendanceSchema = Joi.object({
    day: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/, "day").required().messages({
        "string.pattern.name": "Day must be in the format YYYY-MM-dd (e.g., 2008-09-10)"
    }),
    batchId: Joi.string().regex(/^\d{1,2}[A-Z]:\d{4}-\d{2}$/).required(),
    students: Joi.array().items(Joi.string()).required()
});

export const modifyAttendanceSchema = addAttendanceSchema
    .keys({ batchId: Joi.forbidden() })
    .fork([
        "day",
        "students"
    ], (field) => field.optional())
    .or("day", "students");

export const batchIdSchema = Joi.object({
    batchId: Joi.string()
        .length(24)
        .hex()
        .required()
});