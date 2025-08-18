import mongoose from "mongoose";
import Transaction from "../../models/transaction.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getAllTransactions = asyncHandler(async (req, res) => {
    const { status, trxId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (trxId) query.trxId = trxId;
    const transactions = await Transaction.find(query);

    return res.json(new ApiResponse({ statusCode: 200, data: transactions }));
});

export const updateTransactionStatus = asyncHandler(async (req, res) => {
    const { trxId, status, bankRrn } = req.body;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const transaction = await Transaction.findOne({ trxId, status: "PENDING" }).session(session);
        if (!transaction) {
            throw new ApiError({ statusCode: 400, error: "Invalid transaction id or transaction is not in pending state" });
        }

        transaction.status = status;
        if (bankRrn) transaction.bankRrn = bankRrn;
        transaction.save({ session })
        await session.commitTransaction();

        return res.json(new ApiResponse({ statusCode: 200, message: "Transaction status updated successfully" }));
    } catch (error) {
        console.log("🚀 ~ :34 ~ error:", error);
        await session.abortTransaction();
        throw new ApiError({ statusCode: error.statusCode || 500, error: error.message || "Failed to update transaction status" });
    } finally {
        session.endSession();
    }
});