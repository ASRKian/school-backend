import express from "express";
import { getUsers, addUser, registerUser, loginUser, logOut, getSingleUser, updateUser, authTokenReVerify } from "../../controllers/admin/user.controller.js";
import { celebrate, Joi } from "celebrate";
import { userVerify, userAuthAdmin } from "../../middlewares/userAuth.js";
const router = express.Router();

router.get("/", userVerify, userAuthAdmin, getUsers);

router.get("/:id", celebrate({
    params: Joi.object({
        id: Joi.string().trim().length(24).required(),
    })
}), userVerify, userAuthAdmin, getSingleUser);

router.post("/", celebrate({
    body: Joi.object({
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
        amountDue: Joi.number().default(0),
        amountPaid: Joi.number().optional(),
        amountDue: Joi.number().optional(),
        role: Joi.string().valid("ADMIN", "TEACHER", "STUDENT").default("STUDENT"),
        status: Joi.string().valid("UNPAID", "PAID", "INACTIVE", "ACTIVE"),
        standard: Joi.string().optional(),
        subjects: Joi.array().items(Joi.string()).optional(),
        qualification: Joi.string().optional()
    })
}), userVerify, userAuthAdmin, addUser)

router.put("/:id", [celebrate({
    body: Joi.object({
        fullName: Joi.string().optional(),
        avatar: Joi.string().optional(),
        email: Joi.string().optional(),
        mobileNumber: Joi.string().optional(),
        password: Joi.string().optional(),
        address: Joi.string().optional(),
        gender: Joi.string().valid("MALE", "FEMALE", "OTHER").optional(),
        dob: Joi.date().optional(),
        batch: Joi.string().optional(),
        course: Joi.string().optional(),
        pincode: Joi.number().optional(),
        fatherName: Joi.string().optional(),
        motherName: Joi.string().optional(),
        fatherNo: Joi.string().optional(),
        motherNo: Joi.string().optional(),
        panCard: Joi.string().optional(),
        aadharCard: Joi.string().optional(),
        amountDue: Joi.number().default(0),
        amountPaid: Joi.number().optional(),
        amountDue: Joi.number().optional(),
        role: Joi.string().valid("ADMIN", "TEACHER", "STUDENT").default("STUDENT"),
        status: Joi.string().valid("UNPAID", "PAID", "INACTIVE", "ACTIVE").optional(),
        standard: Joi.string().optional(),
        subjects: Joi.array().items(Joi.string()).optional(),
        qualification: Joi.string().optional()
    }),
    params: Joi.object({
        id: Joi.string().trim().length(24).required(),
    })
}), userVerify, userAuthAdmin], updateUser)

router.post("/login", celebrate({
    body: Joi.object({
        uniqueId: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string().required(),
    }).or("uniqueId", "email")
}), loginUser)

router.get("/authTokenReVerify", authTokenReVerify)

router.post("/register", celebrate({
    body: Joi.object({
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
        aadharCard: Joi.string().required(),
        amountDue: Joi.number().default(0),
        amountPaid: Joi.number().optional(),
        amountDue: Joi.number().optional(),
        role: Joi.string().valid("ADMIN", "TEACHER", "STUDENT").default("STUDENT"),
        status: Joi.string().valid("UNPAID", "PAID", "INACTIVE", "ACTIVE"),
        standard: Joi.string().optional(),
        subjects: Joi.array().items(Joi.string()).optional(),
        qualification: Joi.string().optional()
    })
}), userVerify, userAuthAdmin, registerUser)

router.get("/logout", logOut)

export default router;