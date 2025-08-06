import { ApiResponse } from "../../utils/ApiResponse.js"
import User from "../../models/user.model.js"
import bcrypt from "bcrypt"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

export const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find().select("-password -refreshToken").lean() || [];
        return res.status(200).json(new ApiResponse({ statusCode: 200, data: users, message: "Users fetched successfully" }));
    } catch (error) {
        return res.status(500).json(new ApiError({ statusCode: 500, error: "Internal server error" }))
    }
});

export const getSingleUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select("-password -refreshToken").lean();

        if (!user) {
            return res.status(404).json(new ApiError({ statusCode: 404, error: "User not found" }));
        }

        return res.status(200).json(new ApiResponse({ statusCode: 200, data: user, message: "User fetched successfully" }));
    } catch (error) {
        return res.status(500).json(new ApiError({ statusCode: 500, error: "Internal server error" }))
    }
});

export const addUser = asyncHandler(async (req, res) => {
    await createUser(req.body, false);

    return res.status(201).json(new ApiResponse({
        statusCode: 201,
        message: "User added successfully by admin"
    }));
});

export const updateUser = asyncHandler(async (req, res) => {
    try {
        let id = req.params.id
        await User.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json(new ApiResponse({ statusCode: 200, message: "User updated successfully" }));
    } catch (error) {
        return res.status(500).json(new ApiError({ statusCode: 500, error: "Internal server error" }))
    }
});

export const loginUser = asyncHandler(async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const user = await User.findOne({ $or: [{ userName }, { email }] });

        if (!user) {
            return res.status(401).json(new ApiError({ statusCode: 401, error: "Invalid credentials" }));
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json(new ApiError({ statusCode: 401, error: "Invalid credentials" }));
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: process.env.REFRESH_TOKEN_EXPIRY
        };

        user.password = undefined;
        user.refreshToken = undefined;
        user.isActive = undefined;


        res
            .cookie("refreshToken", refreshToken, options)
            .status(200)
            .json(new ApiResponse({ statusCode: 200, data: user, token: accessToken, message: "User logged in successfully" }));

    } catch (error) {
        return res.status(500).json(new ApiError({ error: "Internal server error", statusCode: 500 }))
    }
});

export const authTokenReVerify = asyncHandler(async (req, res) => {
    return res.cookie("accessToken", accessToken, options).cookie("refreshToken", "refreshToken", options).status(200).json(
        new ApiResponse(200, storeValue, "User logged In Successfully")
    )

});

export const registerUser = asyncHandler(async (req, res) => {
    const { newUser, token, refreshToken } = await createUser(req.body, true);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: process.env.REFRESH_TOKEN_EXPIRY
    });

    return res.status(201).json(new ApiResponse({
        statusCode: 201,
        message: "User registered successfully",
        token
    }));
});

const createUser = async ({ userName, fullName, avatar, email, mobileNumber, password, address }, generateTokens = false) => {
    const isExistingUser = await User.findOne({
        $or: [{ mobileNumber }, { email }, { userName }]
    });

    if (isExistingUser) {
        if (isExistingUser.mobileNumber === mobileNumber) {
            throw new ApiError({ statusCode: 400, error: "Mobile number already registered, please login!" });
        }
        if (isExistingUser.email === email) {
            throw new ApiError({ statusCode: 400, error: "Email already registered, please login!" });
        }
        if (isExistingUser.userName === userName) {
            throw new ApiError({ statusCode: 400, error: "Username already taken" });
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        userName,
        fullName,
        avatar,
        email,
        mobileNumber,
        password: hashedPassword,
        address
    });

    let token = null;
    let refreshToken = null;

    if (generateTokens) {
        token = newUser.generateAccessToken();
        refreshToken = newUser.generateRefreshToken();
        newUser.refreshToken = refreshToken;
    }

    await newUser.save();

    return { newUser, token, refreshToken };
};

export const logOut = asyncHandler(async (req, res) => {
    let userInfo = await User.findById(req.user._id);
    userInfo.refreshToken = undefined;
    await userInfo.save();
    res.clearCookie("refreshToken").status(200).json(new ApiResponse({ statusCode: 200, message: "User logged out successfully" }));
});
