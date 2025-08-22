import { model, Schema } from "mongoose";

const ExamSchema = new Schema({
    type: {
        type: String,
        required: [true, "Please enter exam type !"],
        trim: true
    },
    status: {
        type: String,
        enum: ["UPCOMING", "FINISHED", "RUNNING"],
        default: "UPCOMING"

    },
    batchId: {
        type: String,
        required: [true, "Please enter batch id !"]
    },
    subjects: {
        type: Map,
        of: new Schema({
            date: { type: Date, required: true },
            maxMarks: { type: Number, required: true }
        }, { _id: false }),
        required: [true, "Subjects are required !"]
    },
    startDate: {
        type: Date,
        required: [true, "Please enter exam start date !"]
    }
}, { timestamps: true, versionKey: false });

const ExamModel = model("Exam", ExamSchema);
export default ExamModel;