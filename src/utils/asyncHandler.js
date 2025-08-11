import { ApiError } from "./ApiError.js"

export const asyncHandler = requestHandler => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            if (err.code == 11000) {
                next(new ApiError({ statusCode: 409, error: "Duplicate key error !"}))
            }
            next(new ApiError({ statusCode: err.statusCode, error: err.message }))
        })
    }
}