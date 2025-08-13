import express from 'express';
import { userVerify } from '../../middlewares/userAuth.js';
import { getTimetable } from '../../controllers/user/subjects.timetable.controller.js';

const router = express.Router();

router.get("/", userVerify, getTimetable);

export default router;