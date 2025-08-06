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
        enum: ["Admin", "Teacher", "Student"],
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
        lowercase: true,
        trim: true,
        unique: true,
        required: [true, "Please Enter your email id !"]
    },
    mobileNumber: {
        type: String,
        required: [true, "Please Enter your Mobile Number !"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please Enter your Password !"]
    },
    regNo: {
        type: String,
        unique: true,
        required: [true, "Please Enter your Registration Number !"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    dob: {
        type: Date,
        required: [true, "Please Enter your Date of Birth !"]
    },
    amountPaid: {
        type: Number,
        default: 0
    },
    amountDue: {
        type: Number,
        default: 0
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE", "OTHER"],
        required: [true, "Please Enter gender !"]
    },
    batch: {
        type: String,
        ref: "batch",
        // required: [true, "Please Enter Batch !"]
    },
    course: {
        type: String,
        ref: "course",
        // required: [true, "Please Enter Course !"]
    }
}, { timestamps: true });

const User = new model("user", userSchema, "users");
export default User;