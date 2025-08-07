import express from 'express';
import { userAuthAdmin, userVerify } from '../../middlewares/userAuth.js';
import { addBatch, deleteBatch, getBatchById, getBatches, updateBatch } from '../../controllers/admin/batch.controller.js';
import { celebrate, Segments } from 'celebrate';
import { batchSchema, idParamSchema } from '../../validators/batch.validator.js';

const router = express.Router();

router.get('/', userVerify, userAuthAdmin, getBatches);

router.get('/:id', celebrate({
    [Segments.PARAMS]: idParamSchema
}), userVerify, userAuthAdmin, getBatchById);

router.post('/', celebrate({
    [Segments.BODY]: batchSchema
}), userVerify, userAuthAdmin, addBatch);

router.patch('/:id', celebrate({
    [Segments.PARAMS]: idParamSchema,
    [Segments.BODY]: batchSchema
}), userVerify, userAuthAdmin, updateBatch);

router.delete('/:id', celebrate({
    [Segments.PARAMS]: idParamSchema
}), userVerify, userAuthAdmin, deleteBatch);

export default router;