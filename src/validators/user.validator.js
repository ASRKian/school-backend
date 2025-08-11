import { Joi } from "celebrate";

export const addUserSchema = Joi.object({
    fullName: Joi.string().required(),
    avatar: Joi.string().required(),
    email: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    password: Joi.string().required(),
    address: Joi.string().required(),
    gender: Joi.string().valid("MALE", "FEMALE", "OTHER").required(),
    dob: Joi.date().required(),
    batch: Joi.string().optional(),
    course: Joi.string().optional(),
    pincode: Joi.number().required(),
    fatherName: Joi.string().optional(),
    motherName: Joi.string().optional(),
    fatherNo: Joi.string().optional(),
    motherNo: Joi.string().optional(),
    panCard: Joi.string().optional(),
    aadharCard: Joi.string().optional(),
    amountDue: Joi.number().optional().default(0),
    amountPaid: Joi.number().optional(),
    role: Joi.string().valid("ADMIN", "TEACHER", "STUDENT").default("STUDENT"),
    status: Joi.string().valid("UNPAID", "PAID", "INACTIVE", "ACTIVE"),
    standard: Joi.string().optional(),
    subjects: Joi.array().items(Joi.string()).optional(),
    qualification: Joi.string().optional()
});

export const updateUserSchema = addUserSchema
    .keys({ password: Joi.forbidden() })
    .fork(
        [
            "fullName",
            "avatar",
            "email",
            "mobileNumber",
            "address",
            "gender",
            "dob",
            "pincode"
        ],
        (field) => field.optional()
    );

export const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

export const uniqueIdSchema = Joi.object({
    uniqueId: Joi.string().required()
})