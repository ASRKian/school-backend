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
            marks: {
                type: Number,
                required: true
            },
            grade: {
                type: String,
                enum: ["A+", "A", "B+", "B", "C", "D", "E", "F"],
                required: true
            },
            rank: {
                type: Number,
                required: true,
                min: 1
            },
            maxMarks: {
                type: Number,
                required: true
            }
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
        type: Number,
        required: true
    }
}, { timestamps: true, versionKey: false });


const ReportModel = model("Report", ReportSchema);
export default ReportModel;