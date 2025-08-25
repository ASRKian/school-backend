import { Joi } from "celebrate";

const objectId = Joi.string()
    .length(24)
    .hex()
    .messages({ "string.length": "{#label} must be a 24-char hex ObjectId" });

export const createCouponSchema = Joi.object({
    code: Joi.string().trim().required(),

    validFrom: Joi.date().iso().required(),

    validTill: Joi.date()
        .iso()
        .greater(Joi.ref("validFrom"))
        .required()
        .messages({ "date.greater": "validTill must be after validFrom" }),

    discountType: Joi.string().valid("FLAT", "PERCENTAGE").required(),

    discount: Joi.number()
        .min(0)
        .required()
        .when("discountType", {
            is: "PERCENTAGE",
            then: Joi.number()
                .max(100)
                .messages({ "number.max": "percentage discount cannot exceed 100" }),
        }),

    maxDiscount: Joi.number().min(0).default(Number.POSITIVE_INFINITY),

    batchId: Joi.string().optional(),
    studentId: Joi.string().optional(),
})
    .prefs({ abortEarly: false, stripUnknown: true });
