import express from 'express'
import { getReports } from '../../controllers/user/report.controller.js';
import { userVerify } from '../../middlewares/userAuth.js';

const router = express.Router();

router.get("/", userVerify, getReports);

export default router;