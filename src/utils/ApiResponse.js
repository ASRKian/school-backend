export class ApiResponse {
    constructor({ statusCode, data = undefined, token = undefined, totalDocs = undefined, message = "Success" }) {
        this.statusCode = statusCode;
        this.data = data;
        this.totalDocs = totalDocs;
        this.message = message;
        this.token = token;
    }
}