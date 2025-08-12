import express from 'express';
import { addReport, deleteReport, getReportById, getReports, updateReport } from '../../controllers/admin/report.controller.js';
import { userAuthAdmin, userVerify } from '../../middlewares/userAuth.js';
import { celebrate, Segments } from 'celebrate';
import { reportSchema, updateReportSchema } from '../../validators/report.validator.js';

const router = express.Router();

router.post('/',
    celebrate({
        [Segments.BODY]: reportSchema
    }), userVerify, userAuthAdmin(["ADMIN", "TEACHER"]), addReport);

router.get('/', userVerify, userAuthAdmin(["ADMIN", "TEACHER"]), getReports);

router.get('/:uniqueId', userVerify, userAuthAdmin(["ADMIN", "TEACHER", "STUDENT"]), getReportById);

router.patch('/:id', celebrate({
    [Segments.BODY]: updateReportSchema
}), userVerify, userAuthAdmin(["ADMIN", "TEACHER"]), updateReport);

router.delete('/:id', userVerify, userAuthAdmin(["ADMIN", "TEACHER"]), deleteReport);

export default router;