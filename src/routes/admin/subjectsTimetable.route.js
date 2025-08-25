import express from 'express';
import { celebrate, Segments } from 'celebrate';
import { userAuthAdmin, userVerify } from '../../middlewares/userAuth.js';
import { addTimetable, getTimetable } from '../../controllers/admin/subjectsTimetable.controller.js';
import { timetableSchema } from '../../validators/subjectsTimetable.validator.js';

const router = express.Router()

router.get("/", userVerify, userAuthAdmin(["TEACHER", "ADMIN"]), getTimetable);

router.post("/", celebrate({
    [Segments.BODY]: timetableSchema
}), userVerify, userAuthAdmin(["ADMIN"]), addTimetable);

export default router;