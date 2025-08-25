import mongoose from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getPaymentService } from "../../utils/PaymentFactory.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import Transaction from "../../models/transaction.model.js";
import User from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import Coupon from "../../models/coupon.model.js";

export const payFee = asyncHandler(async (req, res) => {
    const studentId = req.user.uniqueId;
    const batchId = req.user.batch;
    let { amount, coupon } = req.body;
    let totalDiscount = 0;
    if (coupon) {
        const { discountedAmount, totalDiscount: discount } = await applyCoupon(coupon, studentId, amount, batchId);
        amount = discountedAmount;
        totalDiscount = discount;
    }
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const paymentService = getPaymentService();
        let data;
        if (!coupon) {
            const result = await paymentService.init(amount, "CREDIT", studentId);
            data = {
                transactionId: result.transactionId,
                paymentUrl: result.paymentUrl
            }
        } else {
            data = {
                transactionId: coupon,
                paymentUrl: ""
            }
        }

        await Transaction.create([{ panelUse: process.env.PAYMENT_PROVIDER, amount, trxId: data.transactionId, paymentUrl: data.paymentUrl, studentId, type: "CREDIT", coupon, discount: totalDiscount, status: coupon ? "SUCCESS" : "PENDING" }], { session });

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

const applyCoupon = async (coupon, studentId, amount, batchId) => {
    const couponData = await Coupon.findOne({ code: coupon }).lean();

    if (!isCouponValid(couponData, studentId, batchId)) {
        throw new ApiError({ statusCode: 404, error: "invalid coupon code" })
    }

    let discounted = amount;
    let totalDiscount = 0;

    if (couponData.discountType === "FLAT") {
        discounted = amount - couponData.discount;
        totalDiscount = Math.min(couponData.discount, amount);
    } else if (couponData.discountType === "PERCENTAGE") {
        const discount = (amount * couponData.discount) / 100;
        const cappedDiscount = Math.min(discount, couponData.maxDiscount);
        discounted = amount - cappedDiscount;
        totalDiscount = cappedDiscount;
    }

    return { discountedAmount: Math.max(0, discounted), totalDiscount }
}

const isCouponValid = async (coupon, studentId, batchId) => {
    const now = new Date();
    if (!coupon) return false;

    if (coupon.validFrom > now || coupon.validTill < now) return false;

    if (coupon.studentId && coupon.batchId) {
        return coupon.studentId === studentId || coupon.batchId === batchId;
    }

    if (coupon.studentId) {
        return coupon.studentId === studentId;
    }

    if (coupon.batchId) {
        return coupon.batchId === batchId;
    }

    const isAlreadyUsedCoupon = await Transaction.findOne({ trxId: coupon.code, studentId })

    if (isAlreadyUsedCoupon) {
        return false;
    }

    return true;
}
