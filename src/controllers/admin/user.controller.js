import { ApiResponse } from "../../utils/ApiResponse.js"
import User from "../../models/user.model.js"
import bcrypt from "bcrypt"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { appendRandomChars } from "../../utils/AppendRandomChars.js"
import jwt from 'jsonwebtoken'
import { flattenNestedObject } from "../../utils/flattenNestedObject.js"
import UserRegInfo from "../../models/user.regInfo.js"
import mongoose from "mongoose"
import { userRequest, userResponse } from "../../utils/userDto.js"

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

export const getUsers = asyncHandler(async (req, res) => {
    const type = req.query.type;
    if (!["ADMIN", "TEACHER", "STUDENT"].includes(type)) {
        return res.status(404).json(new ApiError({ statusCode: 404, error: "available types: ['ADMIN', 'TEACHER', 'STUDENT'] " }));
    }
    const users = await User.find({ role: type }).select("-password -__v -updatedAt").lean() || [];
    return res.status(200).json(new ApiResponse({ statusCode: 200, data: users, message: "Users fetched successfully" }));

});

export const getSingleUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password -updatedAt -__v").lean();

    if (!user) {
        return res.status(404).json(new ApiError({ statusCode: 404, error: "User not found" }));
    }

    return res.status(200).json(new ApiResponse({ statusCode: 200, data: user, message: "User fetched successfully" }));
});

export const addUser = asyncHandler(async (req, res) => {
    await createUser(req.body, false);

    return res.status(201).json(new ApiResponse({
        statusCode: 201,
        message: "User added successfully"
    }));
});

export const updateUser = asyncHandler(async (req, res) => {
    try {
        let id = req.params.id
        await User.findByIdAndUpdate(id, {
            $set: flattenNestedObject(req.body)
        }, { new: true });

        return res.status(200).json(new ApiResponse({ statusCode: 200, message: "User updated successfully" }));
    } catch (error) {
        return res.status(500).json(new ApiError({ statusCode: 500, error: "Internal server error" }))
    }
});

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

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: process.env.REFRESH_TOKEN_EXPIRY.replace("d", "") * 24 * 60 * 60 * 1000 // Convert days to milliseconds
    };

    const responseData = userResponse(user);

    res
        .cookie("refreshToken", refreshToken, options)
        .status(200)
        .json(new ApiResponse({ statusCode: 200, data: responseData, token: accessToken, message: "User logged in successfully" }));

});

export const authTokenReVerify = asyncHandler(async (req, res) => {
    return res.cookie("accessToken", accessToken, options).cookie("refreshToken", "refreshToken", options).status(200).json(
        new ApiResponse(200, storeValue, "User logged In Successfully")
    )

});

export const registerUser = asyncHandler(async (req, res) => {
    const { newUser, accessToken, refreshToken } = await createUser(req.body, true);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: process.env.REFRESH_TOKEN_EXPIRY.replace("d", "") * 24 * 60 * 60 * 1000 // Convert days to milliseconds
    });

    return res.status(201).json(new ApiResponse({
        statusCode: 201,
        message: "User registered successfully",
        token: accessToken
    }));
});


const createUser = async (data, generateTokens = false) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let { requestUser, requestUserReg } = userRequest(data);

        let accessToken = null;
        let refreshToken = null;

        if (generateTokens) {
            const tokens = await generateAccessAndRefreshTokens({ uniqueId: requestUser.uniqueId, type: "STUDENT" });
            accessToken = tokens.accessToken;
            refreshToken = tokens.refreshToken;
        }

        const hashedPassword = await bcrypt.hash(requestUser.password, 10);
        requestUser.password = hashedPassword;

        await UserRegInfo.create([requestUserReg], { session });

        const [newUser] = await User.create([requestUser], { session });

        await session.commitTransaction();

        const responseData = userResponse(newUser);

        return { responseData, accessToken, refreshToken };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const logOut = asyncHandler(async (req, res) => {
    let userInfo = await User.findById(req.user._id);
    userInfo.refreshToken = undefined;
    await userInfo.save();
    res.clearCookie("refreshToken").status(200).json(new ApiResponse({ statusCode: 200, message: "User logged out successfully" }));
});
