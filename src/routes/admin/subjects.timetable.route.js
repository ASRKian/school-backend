import express from 'express';
import { celebrate, Segments } from 'celebrate';
import { userAuthAdmin, userVerify } from '../../middlewares/userAuth.js';
import { addTimetable, getTimetable } from '../../controllers/admin/subjects.timetable.controller.js';
import { timetableSchema } from '../../validators/subjects.timetable.validator.js';

const router = express.Router()

router.get("/", userVerify, userAuthAdmin(["TEACHER", "ADMIN"]), getTimetable);

router.post("/", celebrate({
    [Segments.BODY]: timetableSchema
}), userVerify, userAuthAdmin(["ADMIN"]), addTimetable);

export default router;