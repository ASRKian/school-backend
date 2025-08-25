import express from "express";
import { userAuthAdmin, userVerify } from "../../middlewares/userAuth.js";
import { createCoupon, getCoupons } from "../../controllers/admin/coupon.controller.js";
import { celebrate, Segments } from "celebrate";
import { createCouponSchema } from "../../validators/coupon.validator.js";

const router = express.Router();

router.get("/", userVerify, userAuthAdmin(["ADMIN", "TEACHER"]), getCoupons);

router.post("/", celebrate({
    [Segments.BODY]: createCouponSchema
}), userVerify, userAuthAdmin(["ADMIN", "TEACHER"]), createCoupon);

export default router;