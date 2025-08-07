import { model, Schema } from "mongoose";

const AttendanceSchema = new Schema({
    day: {
        type: Date,
        required: [true, "Please Enter Day !"]
    },
    batchId: {
        type: String,
        required: [true, "Please Enter Batch ID !"]
    },
    students: [String]
}, { timestamps: true, versionKey: false });

const AttendanceModel = model("Attendance", AttendanceSchema, "attendance");
export default AttendanceModel;
