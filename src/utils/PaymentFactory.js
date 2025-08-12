import { PaytmService } from './Paytm.service.js'

export function getPaymentService() {
    const provider = process.env.PAYMENT_PROVIDER;
    // return new PaytmService();

    switch (provider) {
        case "paytm":
            return new PaytmService();
        default:
            throw new Error(`Unsupported payment provider: ${provider}`);
    }
}
