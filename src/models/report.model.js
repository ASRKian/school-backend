import { Schema, model } from "mongoose";

const ReportSchema = new Schema({
    uniqueId: {
        type: String,
        required: [true, "Please Enter Unique ID !"],
        unique: true
    },
    examType: {
        type: String,
        required: [true, "Please Enter Exam Type !"]
    },
    batchId: {
        type: String,
        required: [true, "Please Enter Batch ID !"]
    },
    report: {
        type: Map,
        of: new Schema({
            marks: Number,
            grade: String,
            rank: Number,
            maxMarks: Number
        }, { _id: false }),
        required: true
    },
    status: {
        type: String,
        enum: ["FAIL", "PASS"]
    },
    studentId: {
        type: String,
        required: [true, "Please Enter Student ID !"]
    },
    percentage: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false });


const ReportModel = model("Report", ReportSchema);
export default ReportModel;