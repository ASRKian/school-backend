import express from 'express'
import { userVerify } from '../../middlewares/userAuth.js';
import { getExams } from '../../controllers/user/exam.controller.js';

const router = express.Router();

router.get("/", userVerify, getExams);

export default router;