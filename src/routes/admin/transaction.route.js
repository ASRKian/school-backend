import express from 'express';
import { userAuthAdmin, userVerify } from '../../middlewares/userAuth.js';
import { getAllTransactions, updateTransactionStatus } from '../../controllers/admin/transaction.controller.js';
import { celebrate, Segments } from 'celebrate';
import { transactionQuerySchema, transactionUpdateSchema } from '../../validators/transaction.validator.js';

const router = express.Router();

router.get("/", celebrate({
    [Segments.QUERY]: transactionQuerySchema
}), userVerify, userAuthAdmin(["ADMIN", "TEACHER"]), getAllTransactions);

router.post("/update-status", celebrate({
    [Segments.BODY]: transactionUpdateSchema
}), userVerify, userAuthAdmin(["ADMIN", "TEACHER"]), updateTransactionStatus)

export default router;