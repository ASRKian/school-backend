import { Joi } from "celebrate";

export const reportSchema = Joi.object({
    examType: Joi.string().trim().required(),
    subjects: Joi.array().items(Joi.string().trim().required()).min(1).required(),
    studentId: Joi.string().trim().required(),
    status: Joi.string().valid("PASSED", "FAILED").required(),
    marks: Joi.array().items(Joi.number().min(0)).length(Joi.ref("subjects.length")).required(),
    grade: Joi.array().items(Joi.string().pattern(/^[A-F]$/)).length(Joi.ref("subjects.length")).required(),
    rank: Joi.array().items(Joi.number().integer().min(1)).length(Joi.ref("subjects.length")).required()
});

export const updateReportSchema = Joi.object({
    subjectName: Joi.string().required(),
    newMarks: Joi.number().required(),
    newGrade: Joi.string().pattern(/^[A-F]$/),
    newRank: Joi.number().integer().min(1),
    status: Joi.string().valid("FAILED", "PASSED").optional()
})