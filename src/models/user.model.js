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
        required: [true, "Please Select member Type !"]
    },
    fullName: {
        type: String,
        trim: true,
        required: [true, "Please Enter your Full Name !"]
    },
    avater: {
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
    addresh: {
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
        addresh: {
            type: String,
            required: [true, "Please Enter Addresh !"]
        },
        pincode: {
            type: Number,
            required: [true, "Please Enter Pincode !"]
        },
    },
    minWalletBalance: {
        type: Number,
        required: [true, "Please Enter minimum Walllet Balance Hold !"]
    },
    upiWalletBalance: {
        type: Number,
        default: 0
    },
    EwalletBalance: {
        type: Number,
        default: 0
    },
    EwalletFundLock: {
        type: Number,
        default: 0
    },
    HoldingAmount: {
        type: Number,
        default: 0
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

export default new model("user", userSchema);