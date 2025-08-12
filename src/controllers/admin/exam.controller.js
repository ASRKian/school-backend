import Exam from "../../models/exam.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createUpcomingExam = asyncHandler(async (req, res) => {
    const { type, batchId, subjects } = req.body;

    await Exam.create({ type, batchId, subjects });
    return res.status(201).json(new ApiResponse({ statusCode: 201, message: "Exam created successfully" }));
});

export const getExams = asyncHandler(async (req, res) => {
    const { batchId } = req.query;
    const query = {};
    if (batchId) query.batchId = batchId;

    const exams = await Exam.find(query);
    if (!exams.length) {
        throw new ApiError({ statusCode: 404, error: "No exams found for given batchId" });
    }

    return res.json(new ApiResponse({ statusCode: 200, data: exams }));
});