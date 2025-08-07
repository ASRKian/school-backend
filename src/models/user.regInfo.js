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
    },
    motherName: {
        type: String,
    },
    fatherNo: {
        type: String,
    },
    motherNo: {
        type: String,
    },
    panCard: {
        type: String,
        length: 10,
        uppercase: true
    },
    aadharCard: {
        type: String,
        length: 12
    },
    uniqueId: {
        type: String,
        unique: true,
        trim: true,
        index: true,
        required: [true, "Please Enter uniqueId !"]
    },
})

const UserRegInfoModel = model("userRegInfo", UserRegInfo);
export default UserRegInfoModel;