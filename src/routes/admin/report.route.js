import express from 'express';
import { addReport, deleteReport, getReportById, getReports, updateReport } from '../../controllers/admin/report.controller.js';
import { userAuthAdmin, userVerify } from '../../middlewares/userAuth.js';

const router = express.Router();

router.post('/', userVerify, userAuthAdmin, addReport);

router.get('/', userVerify, userAuthAdmin, getReports);

router.get('/:id', userVerify, userAuthAdmin, getReportById);

router.patch('/:id', userVerify, userAuthAdmin, updateReport);

router.delete('/:id', userVerify, userAuthAdmin, deleteReport);

export default router;