import express from 'express';
import { addAttendance, getAttendance, modifyAttendance } from '../../controllers/admin/attendance.controller.js';
import { celebrate, Segments } from 'celebrate';
import { addAttendanceSchema, batchIdSchema, modifyAttendanceSchema } from '../../validators/attendance.validator.js';
import { userAuthAdmin, userVerify } from '../../middlewares/userAuth.js';

const router = express.Router();

router.post('/', celebrate({
    [Segments.BODY]: addAttendanceSchema
}), userVerify, userAuthAdmin, addAttendance);

router.get('/', userVerify, userAuthAdmin, getAttendance);

router.patch('/:id', celebrate({
    [Segments.BODY]: modifyAttendanceSchema,
    [Segments.PARAMS]: batchIdSchema
}), userVerify, userAuthAdmin, modifyAttendance);

export default router;