import { TransactionService } from "./Transaction.service.js";

export class PaytmService extends TransactionService {
    async init(amount, type, studentId) {
        // TODO: Call Paytm API
        return {
            transactionId: "PAYTM_" + Date.now(),
            paymentUrl: "https://paytm.com/pay/xyz"
        };
    }

    async webhook(payload) {
        // TODO: Parse Paytm payload
        return {
            transactionId: payload.trxId,
            status: payload.status,
            bankRrn: payload.rrn
        };
    }
}
