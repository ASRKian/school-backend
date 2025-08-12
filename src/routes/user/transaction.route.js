import express from 'express'
import { userVerify } from '../../middlewares/userAuth.js';
import { getTransactions, payFee, webhook } from '../../controllers/user/transaction.controller.js';

const router = express.Router();

router.get("/", userVerify, getTransactions);

router.post("/pay", userVerify, payFee);

router.post("/webhook", webhook);

export default router;