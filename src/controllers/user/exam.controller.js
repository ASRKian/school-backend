import Exam from "../../models/exam.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getExams = asyncHandler(async (req, res) => {
    const { status = "UPCOMING" } = req.query;
    const batchId = req.user.batch;
    const query = { status, batchId };

    const upcomingExams = await Exam.find(query);
    if (!upcomingExams.length) {
        throw new ApiError({ statusCode: 400, error: `No upcoming exams found` })
    }

    return res.json(new ApiResponse({ statusCode: 200, data: upcomingExams }));
});