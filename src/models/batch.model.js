import { model, Schema } from "mongoose";

const BatchSchema = new Schema({
    subjects: [String],
    uniqueId: {
        type: String,
        unique: true,
        required: [true, "Please Enter Unique ID !"]
    }
}, { timestamps: true, versionKey: false });

const BatchModel = model("Batch", BatchSchema);
export default BatchModel;