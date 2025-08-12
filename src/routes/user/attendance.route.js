import express from 'express';
import { getAttendance } from '../../controllers/user/attendance.controller.js';
import { userVerify } from '../../middlewares/userAuth.js';

const router = express.Router()

router.get("/", userVerify, getAttendance);

export default router;