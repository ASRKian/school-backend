export class ApiError extends Error {
    constructor({ statusCode = 500, error = "Something Went Wrong" }) {
        super(error);
        this.statusCode = statusCode;
        this.error = error;
        this.data = null;
    }
}