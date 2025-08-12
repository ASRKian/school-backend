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

        if (user.status === "INACTIVE") {
            throw new ApiError({ statusCode: 403, error: "Inactive user" })
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("🚀 ~ :28 ~ error:", error);
        throw new ApiError({ statusCode: error.statusCode || 401, error: error?.message || "Invalid access token" });
    }
});

export const userAuthAdmin = (allowedRoles) =>
    asyncHandler((req, res, next) => {
        const userRole = req.user?.role;

        if (allowedRoles.includes(userRole)) {
            return next();
        }
        throw new ApiError({
            statusCode: 403,
            error: "User does not have permission to access this resource"
        });
    });
