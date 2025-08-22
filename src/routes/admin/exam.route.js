import express from 'express'
import { userAuthAdmin, userVerify } from '../../middlewares/userAuth.js';
import { createUpcomingExam, getExamDetails, getExams } from '../../controllers/admin/exam.controller.js';
import { celebrate, Segments } from 'celebrate';
import { createExamSchema, getExamsSchema } from '../../validators/exam.validator.js';

const router = express.Router();

router.get("/", celebrate({
    [Segments.QUERY]: getExamsSchema
}), userVerify, userAuthAdmin(["ADMIN", "TEACHER"]), getExams);

router.post("/", celebrate({
    [Segments.BODY]: createExamSchema
}), userVerify, userAuthAdmin(["ADMIN", "TEACHER"]), createUpcomingExam);

router.get("/:id", userVerify, userAuthAdmin(["ADMIN", "TEACHER"]), getExamDetails);

export default router;