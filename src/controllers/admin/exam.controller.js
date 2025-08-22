import mongoose from "mongoose";
import Batch from "../../models/batch.model.js";
import Exam from "../../models/exam.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

function getMongooseObjectId(objectId) {
    if (!mongoose.isValidObjectId(objectId)) {
        throw new ApiError({ statusCode: 404, error: "not a valid object id" });
    }
    return mongoose.Types.ObjectId.createFromHexString(objectId);
}

export const createUpcomingExam = asyncHandler(async (req, res) => {
    const { type, batchId, subjects } = req.body;

    const isValidBatchId = await Batch.findOne({ uniqueId: batchId });

    if (!isValidBatchId) {
        throw new ApiError({ statusCode: 404, error: "invalid batchId" });
    }

    const getSubjects = Object.keys(subjects);

    let startDate = null;

    for (const subject of getSubjects) {
        if (!isValidBatchId.subjects.includes(subject)) {
            throw new ApiError({ statusCode: 404, error: `Invalid subject name ${subject}` });
        }

        const currentDate = subjects[subject].date && new Date(subjects[subject].date);
        if (!startDate || currentDate < startDate) {
            startDate = currentDate;
        }
    }


    await Exam.create({ type, batchId, subjects, startDate });
    return res.status(201).json(new ApiResponse({ statusCode: 201, message: "Exam created successfully" }));
});

export const getExams = asyncHandler(async (req, res) => {
    const { batchId } = req.query;
    const query = {};
    if (batchId) query.batchId = batchId;

    const exams = await Exam.find(query).select("-batchId -subjects -createdAt -updatedAt");
    if (!exams.length) {
        throw new ApiError({ statusCode: 404, error: "No exams found for given batchId" });
    }

    return res.json(new ApiResponse({ statusCode: 200, data: exams }));
});

export const getExamDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pipeline = [
        {
            $match: {
                _id: getMongooseObjectId(id)
            }
        },
        {
            $lookup: {
                from: "reports",
                localField: "batchId",
                foreignField: "batchId",
                as: "reports"
            }
        },
        {
            $project: {
                _id: 1,
                type: 1,
                status: 1,
                subjects: 1,
                createdAt: 1,
                "reports.studentId": 1,
                "reports.percentage": 1,
                "reports.status": 1,
                "reports.uniqueId": 1
            }
        }
    ]

    const exam = await Exam.aggregate(pipeline);

    if (!exam.length) {
        throw new ApiError({ statusCode: 404, error: "Invalid exam id" });
    }

    return res.json(new ApiResponse({ statusCode: 200, data: exam }));
});