import { Schema, model } from "mongoose";

const userSchema = new Schema({
    uniqueId: {
        type: String,
        unique: true,
        trim: true,
        index: true,
        required: [true, "Please Enter uniqueId !"]
    },
    role: {
        type: String,
        enum: ["ADMIN", "TEACHER", "STUDENT"],
        default: "STUDENT",
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
        lowercase: true,
        trim: true,
        unique: true,
        required: [true, "Please Enter your email id !"]
    },
    mobileNumber: {
        type: String,
        required: [true, "Please Enter your Mobile Number !"],
    },
    password: {
        type: String,
        required: [true, "Please Enter your Password !"]
    },
    status: {
        type: String,
        enum: ["UNPAID", "PAID", "INACTIVE", "ACTIVE"]
    },
    dob: {
        type: Date,
        required: [true, "Please Enter your Date of Birth !"]
    },
    amountPaid: {
        type: Number,
    },
    amountDue: {
        type: Number,
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE", "OTHER"],
        required: [true, "Please Enter gender !"]
    },
    batch: {
        type: String,
        // required: [true, "Please Enter Batch !"]
    },
    course: {
        type: String,
        // required: [true, "Please Enter Course !"]
    },
    standard: {
        type: String,
    },
    subjects: {
        type: [String],
        default: undefined
    },
    qualification: {
        type: String
    }
}, { timestamps: true });

const User = new model("user", userSchema, "users");
export default User;