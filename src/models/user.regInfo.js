import { model, Schema } from "mongoose";

const UserRegInfo = new Schema({
    address: {
        type: String,
        required: [true, "Please Enter Address !"]
    },
    pincode: {
        type: Number,
        required: [true, "Please Enter Pincode !"],
        length: 6
    },
    fatherName: {
        type: String,
        required: [true, "Please Enter Father's Name !"]
    },
    motherName: {
        type: String,
        required: [true, "Please Enter Mother's Name !"]
    },
    fatherNo: {
        type: String,
        required: [true, "Please Enter Father's Mobile Number !"]
    },
    motherNo: {
        type: String,
    },
    panCard: {
        type: String
    },
    aadharCard: {
        type: String,
        required: [true, "Please Enter Aadhar Card Number !"]
    },
    uniqueId: {
        type: String,
        unique: true,
        trim: true,
        index: true,
        required: [true, "Please Enter uniqueId !"]
    },
})

const UserRegInfoModel = new model("userRegInfo", UserRegInfo);
export default UserRegInfoModel;