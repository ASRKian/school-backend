import { Schema, model } from 'mongoose';

const TransactionSchema = new Schema({
    panelUse: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    trxId: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["DEBIT", "CREDIT"],
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING"
    },
    bankRrn: {
        type: String
    },
    paymentUrl: {
        type: String
    }
}, { timestamps: true, versionKey: false })

const TransactionModel = model("Transaction", TransactionSchema);
export default TransactionModel;