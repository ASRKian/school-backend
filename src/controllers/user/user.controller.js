import User from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import bcrypt from 'bcrypt';
import { userResponse } from "../../utils/userDto.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import { ApiResponse } from "../../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (uniqueId, type) => {
    try {
        const accessToken = jwt.sign(
            { uniqueId, role: type, },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })

        const refreshToken = jwt.sign(
            { uniqueId },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        )
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json(new ApiError({ statusCode: 401, error: "Invalid credentials" }));
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json(new ApiError({ statusCode: 401, error: "Invalid credentials" }));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.uniqueId, user.role);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const responseData = userResponse(user);

    res
        .status(200)
        .json(new ApiResponse({ statusCode: 200, data: responseData, token: accessToken, message: "User logged in successfully" }));

});

export const me = asyncHandler(async (req, res) => {
    const uniqueId = req.user.uniqueId;
    const user = await User.aggregate([
        { $match: { uniqueId, role: "STUDENT" } },
        { $project: { password: 0, updatedAt: 0, __v: 0 } },
        {
            $lookup: {
                from: "userreginfos",
                localField: "uniqueId",
                foreignField: "uniqueId",
                as: "regInfo"
            }
        },
        { $unwind: { path: "$regInfo", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                "regInfo._id": 0,
                "regInfo.__v": 0
            }
        }
    ]);

    if (!user) {
        return res.status(404).json(new ApiError({ statusCode: 404, error: "User not found" }));
    }

    return res.status(200).json(new ApiResponse({ statusCode: 200, data: user, message: "User fetched successfully" }));

})