import express from 'express';
import { userVerify } from '../../middlewares/userAuth.js';
import { loginUser, me } from '../../controllers/user/user.controller.js';

const router = express.Router()

router.post("/login", loginUser);

router.get("/me", userVerify, me);

export default router;