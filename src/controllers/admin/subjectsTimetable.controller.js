import Batch from "../../models/batch.model.js";
import SubjectsTimetable from "../../models/subjectsTimetable.model.js";
import User from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addTimetable = asyncHandler(async (req, res) => {
    const { batchId, days } = req.body;

    const validBatchId = await Batch.findOne({ uniqueId: batchId });

    if (!validBatchId) {
        throw new ApiError({ statusCode: 400, error: "Invalid batch Id" });
    }

    const teacherSet = new Set();

    for (const element of days) {
        for (const period of element.periods) {
            teacherSet.add(period.teacher)
        }
    }

    const teacherArray = Array.from(teacherSet);

    const validTeachers = await User.find({ uniqueId: { $in: teacherArray } });

    if (validTeachers.length !== teacherArray.length) {
        throw new ApiError({ statusCode: 400, error: "Invalid teacher Ids" });
    }

    await SubjectsTimetable.create({ batchId, days });
    return res.status(201).json(new ApiResponse({ statusCode: 201, message: "timetable added successfully" }));
});


export const getTimetable = asyncHandler(async (req, res) => {
    const { batchId } = req.query;
    const pipeline = []

    if (batchId) pipeline.push({ $match: { batchId } });
    else pipeline.push({ $match: {} });

    pipeline.push(
        { $unwind: "$days" },
        { $unwind: "$days.periods" },

        {
            $lookup: {
                from: "users",
                localField: "days.periods.teacher",
                foreignField: "uniqueId",
                as: "teacherInfo"
            }
        },
        { $unwind: { path: "$teacherInfo", preserveNullAndEmptyArrays: true } },

        {
            $set: {
                "days.periods.teacher": "$teacherInfo.fullName"
            }
        },

        {
            $group: {
                _id: {
                    _id: "$_id",
                    batchId: "$batchId",
                    day: "$days.day"
                },
                periods: { $push: "$days.periods" }
            }
        },

        {
            $group: {
                _id: "$_id._id",
                batchId: { $first: "$_id.batchId" },
                days: {
                    $push: {
                        day: "$_id.day",
                        periods: "$periods"
                    }
                }
            }
        }
    )

    const timeTable = await SubjectsTimetable.aggregate(pipeline);
    if (!timeTable) {
        throw new ApiError({ statusCode: 404, error: "no time table found" });
    }

    return res.json(new ApiResponse({ statusCode: 200, data: timeTable }));
});