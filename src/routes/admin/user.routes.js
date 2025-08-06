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
        fatherName: Joi.string().required(),
        regNo: Joi.string().required(),
        motherName: Joi.string().required(),
        fatherNo: Joi.string().required(),
        motherNo: Joi.string().optional(),
        panCard: Joi.string().optional(),
        aadharCard: Joi.string().required(),
        amountDue: Joi.number().default(0),
        amountPaid: Joi.number().optional(),
        amountDue: Joi.number().optional(),
        role: Joi.string().valid("Admin", "Teacher", "Student").default("Student")
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
        regNo: Joi.string().optional(),
        amountPaid: Joi.number().optional(),
        amountDue: Joi.number().optional(),
        role: Joi.string().valid("Admin", "Teacher", "Student").default("Student")
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
        fatherName: Joi.string().required(),
        motherName: Joi.string().required(),
        fatherNo: Joi.string().required(),
        motherNo: Joi.string().optional(),
        panCard: Joi.string().optional(),
        aadharCard: Joi.string().required(),
        amountDue: Joi.number().default(0),
        regNo: Joi.string().required(),
        amountPaid: Joi.number().optional(),
        amountDue: Joi.number().optional(),
        role: Joi.string().valid("Admin", "Teacher", "Student").default("Student")
    })
}), userVerify, userAuthAdmin, registerUser)

router.get("/logout", logOut)

export default router;