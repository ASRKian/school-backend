import { Schema, model } from 'mongoose';

const daySchema = new Schema({
    day: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        required: true
    },
    periods: [
        {
            time: {
                type: String,
                required: true
            },
            subject: {
                type: String,
                required: true
            },
            teacher: {
                type: String,
                required: true
            }
        }
    ]
}, { _id: false });

const SubjectsTimetableSchema = new Schema({
    days: [daySchema],
    batchId: {
        type: String,
        required: true,
        unique: true
    }
}, { versionKey: false });


const SubjectsTimetableModel = model("subjects-timetable", SubjectsTimetableSchema);
export default SubjectsTimetableModel;