import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    userName: {
        type: String,
        unique: true,
        trim: true,
        index: true,
        required: [true, "Please Enter username !"]
    },
    userType: {
        type: String,
        enum: ["Admin", "Manager", "Student", "Account"],
        default: "Student",
    },
    fullName: {
        type: String,
        trim: true,
        required: [true, "Please Enter your Full Name !"]
    },
    avatar: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        lowecase: true,
        trim: true,
        unique: true,
        required: [true, "Please Enter your email id !"]
    },
    mobileNumber: {
        type: String,
        required: [true, "Please Enter your Mobile Number !"]
    },
    password: {
        type: String,
        required: [true, "Please Enter your Password !"]
    },
    refreshToken: {
        type: String
    },
    address: {
        country: {
            type: String,
            required: [true, "Please Enter Country"]
        },
        state: {
            type: String,
            required: [true, "Please Enter State"]
        },
        city: {
            type: String,
            required: [true, "Please Enter City !"]
        },
        address: {
            type: String,
            required: [true, "Please Enter Address !"]
        },
        pincode: {
            type: Number,
            required: [true, "Please Enter Pin-code !"]
        },
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
            memberId: this.memberId,
            memberType: this.memberType
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = new model("user", userSchema, "users");
export default User;