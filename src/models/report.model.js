import { Schema, model } from "mongoose";

const ReportSchema = new Schema({
    uniqueId: {
        type: String,
        required: [true, "Please Enter Unique ID !"]
    },
    examType: {
        type: String,
        required: [true, "Please Enter Exam Type !"]
    },
    batchId: {
        type: String,
        required: [true, "Please Enter Batch ID !"]
    },
    subjects: {
        type: Map,
        of: new Schema({
            marks: Number,
            grade: String,
            rank: Number
        }),
        required: true
    }
}, { timestamps: true });


const ReportModel = model("Report", ReportSchema);
export default ReportModel;