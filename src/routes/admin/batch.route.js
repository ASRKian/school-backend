import express from 'express';
import { userAuthAdmin, userVerify } from '../../middlewares/userAuth.js';
import { addBatch, deleteBatch, getBatchById, getBatches, updateBatch } from '../../controllers/admin/batch.controller.js';
import { celebrate, Segments } from 'celebrate';
import { batchPatchSchema, batchSchema, idParamSchema } from '../../validators/batch.validator.js';

const router = express.Router();

router.get('/', userVerify, userAuthAdmin(["ADMIN", "TEACHER"]), getBatches);

router.get('/:id', celebrate({
    [Segments.PARAMS]: idParamSchema
}), userVerify, userAuthAdmin(["ADMIN", "TEACHER"]), getBatchById);

router.post('/', celebrate({
    [Segments.BODY]: batchSchema
}), userVerify, userAuthAdmin(["ADMIN", "TEACHER"]), addBatch);

router.patch('/:id', celebrate({
    [Segments.PARAMS]: idParamSchema,
    [Segments.BODY]: batchPatchSchema
}), userVerify, userAuthAdmin(["ADMIN", "TEACHER"]), updateBatch);

router.delete('/:id', celebrate({
    [Segments.PARAMS]: idParamSchema
}), userVerify, userAuthAdmin(["ADMIN", "TEACHER"]), deleteBatch);

export default router;