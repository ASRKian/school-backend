import mongoose from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getPaymentService } from "../../utils/PaymentFactory.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import Transaction from "../../models/transaction.model.js";
import User from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const payFee = asyncHandler(async (req, res) => {
    const studentId = req.user.uniqueId;
    const { amount } = req.body;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const paymentService = getPaymentService();
        const result = await paymentService.init(amount, "CREDIT", studentId);
        const data = {
            transactionId: result.transactionId,
            paymentUrl: result.paymentUrl
        }

        await Transaction.create([{ panelUse: process.env.PAYMENT_PROVIDER, amount, trxId: result.transactionId, paymentUrl: result.paymentUrl, studentId, type: "CREDIT" }], { session });

        await session.commitTransaction();
        return res.json(new ApiResponse({ statusCode: 200, data }));
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
});

export const getTransactions = asyncHandler(async (req, res) => {
    const uniqueId = req.user.uniqueId;
    const transactions = await Transaction.find({ studentId: uniqueId });

    if (!transactions.length) {
        throw new ApiError({ statusCode: 404, error: "No transactions found for given user" });
    }

    return res.json(new ApiResponse({ statusCode: 200, data: transactions }));
});

export const webhook = asyncHandler(async (req, res) => {
    const payload = req.body;
    const session = await mongoose.startSession();

    try {
        session.startTransaction()
        const paymentService = getPaymentService();
        const result = await paymentService.webhook(payload);

        const pendingTransaction = await Transaction.findOne({ trxId: result.transactionId, status: "PENDING" })

        if (!pendingTransaction) {
            throw new ApiError({ statusCode: 404, error: "transaction not found or already updated" })
        }

        pendingTransaction.status = result.status;
        pendingTransaction.bankRrn = result.bankRrn;
        await pendingTransaction.save({ session, validateBeforeSave: false });

        await User.findOneAndUpdate({ uniqueId: pendingTransaction.studentId }, {
            $inc: {
                amountDue: -pendingTransaction.amount,
                amountPaid: pendingTransaction.amount
            }

        }, { session });

        await session.commitTransaction();
        return res.json(new ApiResponse({ statusCode: 200 }));
    } catch (error) {
        await session.abortTransaction()
        throw error;
    } finally {
        await session.endSession()
    }
});