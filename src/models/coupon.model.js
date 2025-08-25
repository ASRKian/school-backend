import { model, Schema } from "mongoose";

const CouponSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: [true, "coupon code required !"],
        index: true
    },
    validFrom: {
        type: Date,
        required: [true, "validFrom required !"]
    },
    validTill: {
        type: Date,
        required: [true, "validTill required !"]
    },
    maxDiscount: {
        type: Number,
    },
    batchId: {
        type: String
    },
    studentId: {
        type: String
    },
    discountType: {
        type: String,
        enum: ["FLAT", "PERCENTAGE"],
        required: [true, "discount type is one of 'FLAT' or 'PERCENTAGE'"]
    },
    discount: {
        type: Number,
        required: [true, "discount is required !"]
    }
}, { timestamps: true, versionKey: false });

const CouponModel = model("coupon", CouponSchema);
export default CouponModel;