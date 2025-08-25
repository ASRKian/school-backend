import Coupon from "../../models/coupon.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getCoupons = asyncHandler(async (req, res) => {
    const { code } = req.query;

    const query = {};
    if (code) query.code = code;

    const coupons = await Coupon.find(query);
    if (!coupons.length) {
        throw new ApiError({ statusCode: 404, error: code ? "invalid coupon code" : "no coupons found" });
    }

    return res.json(new ApiResponse({ statusCode: 200, data: coupons }))
});

export const createCoupon = asyncHandler(async (req, res) => {
    const { code, validFrom, validTill, discountType, discount, maxDiscount = Infinity, batchId = "", studentId = "" } = req.body;

    await Coupon.create({ code, validFrom, validTill, discountType, discount, maxDiscount, batchId, studentId });

    return res.json(new ApiResponse({ statusCode: 200 }));
})