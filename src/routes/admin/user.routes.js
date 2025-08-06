import express from "express";
import { getUsers, addUser, registerUser, loginUser, logOut, getSingleUser, updateUser, authTokenReVerify } from "../../controllers/admin/user.controller.js";
import { celebrate, Joi } from "celebrate";
import { userVerify, userAuthAdmin } from "../../middlewares/userAuth.js";
const router = express.Router();

router.get("/getUsers", userVerify, getUsers);

router.get("/userProfile/:id", celebrate({
    params: Joi.object({
        id: Joi.string().trim().length(24).required(),
    })
}), userVerify, getSingleUser);

router.post("/addUser", celebrate({
    body: Joi.object({
        userName: Joi.string().required(),
        fullName: Joi.string().required(),
        avatar: Joi.string().optional(),
        email: Joi.string().required(),
        mobileNumber: Joi.string().required(),
        password: Joi.string().required(),
        userType: Joi.string().valid("Admin", "Manager", "Student", "Account").required(),
        address: Joi.object({
            country: Joi.string().required(),
            state: Joi.string().required(),
            city: Joi.string().required(),
            address: Joi.string().required(),
            pincode: Joi.number().required()
        }),
    })
}), userVerify, addUser)

router.post("/updateUser/:id", [celebrate({
    body: Joi.object({
        memberType: Joi.string().valid("Admin", "Manager", "Users").optional(),
        fullName: Joi.string().optional(),
        email: Joi.string().optional(),
        mobileNumber: Joi.string().optional(),
        package: Joi.string().optional(),
        address: Joi.object({
            country: Joi.string().optional(),
            state: Joi.string().optional(),
            city: Joi.string().optional(),
            address: Joi.string().optional(),
            pincode: Joi.number().required()
        }),
        isActive: Joi.boolean().optional(),
    }),
    params: Joi.object({
        id: Joi.string().trim().length(24).required(),
    })
}), userVerify, userAuthAdmin], updateUser)

router.post("/login", celebrate({
    body: Joi.object({
        userName: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string().required(),
    }).or("username", "email")
}), loginUser)

router.get("/authTokenReVerify", authTokenReVerify)

router.post("/register", celebrate({
    body: Joi.object({
        userName: Joi.string().required(),
        fullName: Joi.string().required(),
        avatar: Joi.string().optional(),
        email: Joi.string().required(),
        mobileNumber: Joi.string().required(),
        password: Joi.string().required(),
        address: Joi.object({
            country: Joi.string().optional(),
            state: Joi.string().optional(),
            city: Joi.string().optional(),
            address: Joi.string().optional(),
            pincode: Joi.number().required()
        }).required(),
    })
}), registerUser)

router.get("/logout", logOut)

export default router;