import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const userVerify = asyncHandler(async (req, res, next) => {
    try {

        const token = req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError({ statusCode: 401, error: "Unauthorized request" })
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findOne({ uniqueId: decodedToken.uniqueId }).select("-password -refreshToken")

        if (!user) {
            throw new ApiError({ statusCode: 401, error: "Invalid Access Token" })
        }

        if (user.isActive !== true) {
            throw new ApiError({ statusCode: 403, error: "Inactive user" })
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError({ statusCode: error.statusCode || 401, error: error?.message || "Invalid access token" });
    }
});

export const userAuthAdmin = asyncHandler((req, res, next) => {
    const isAdmin = req.user?.role
    try {
        if (["Admin", "Teacher"].includes(isAdmin)) {
            next();
        } else {
            throw new ApiError({ statusCode: 403, error: "User have not Right to Access the Resource" })
        }
    } catch (error) {
        throw new ApiError({ statusCode: error.statusCode || 401, error: error?.message || "Invalid Access to Resource" });
    }
});

