import express from "express";
import { getUsers, addUser, loginUser, logOut, getSingleUser, updateUser, authTokenReVerify, deleteUser } from "../../controllers/admin/user.controller.js";
import { celebrate, Joi, Segments } from "celebrate";
import { userVerify, userAuthAdmin } from "../../middlewares/userAuth.js";
import { addUserSchema, loginUserSchema, uniqueIdSchema, updateUserSchema } from "../../validators/user.validator.js";
const router = express.Router();

router.get("/", userVerify, userAuthAdmin, getUsers);

router.get("/:uniqueId", celebrate({
    params: Joi.object({
        uniqueId: Joi.string().trim().required(),
    })
}), userVerify, userAuthAdmin, getSingleUser);

router.post("/", celebrate({
    [Segments.BODY]: addUserSchema
}), userVerify, userAuthAdmin, addUser)

router.put("/:uniqueId", [celebrate({
    [Segments.BODY]: updateUserSchema
}), userVerify, userAuthAdmin], updateUser)

router.post("/login", celebrate({
    [Segments.BODY]: loginUserSchema
}), loginUser)

router.get("/authTokenReVerify", authTokenReVerify)

router.get("/logout", logOut);

router.delete("/:uniqueId", celebrate({
    [Segments.PARAMS]: uniqueIdSchema,
}), userVerify, userAuthAdmin, deleteUser);

export default router;