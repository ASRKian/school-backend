import express from "express";
import { getUsers, addUser, loginUser, logOut, getSingleUser, updateUser, authTokenReVerify } from "../../controllers/admin/user.controller.js";
import { celebrate, Joi, Segments } from "celebrate";
import { userVerify, userAuthAdmin } from "../../middlewares/userAuth.js";
import { addUserSchema, loginUserSchema, updateUserSchema } from "../../validators/user.validator.js";
const router = express.Router();

router.get("/", userVerify, userAuthAdmin, getUsers);

router.get("/:id", celebrate({
    params: Joi.object({
        id: Joi.string().trim().length(24).required(),
    })
}), userVerify, userAuthAdmin, getSingleUser);

router.post("/", celebrate({
    [Segments.BODY]: addUserSchema
}), userVerify, userAuthAdmin, addUser)

router.put("/:id", [celebrate({
    [Segments.BODY]: updateUserSchema
}), userVerify, userAuthAdmin], updateUser)

router.post("/login", celebrate({
    [Segments.BODY]: loginUserSchema
}), loginUser)

router.get("/authTokenReVerify", authTokenReVerify)

router.get("/logout", logOut)

export default router;