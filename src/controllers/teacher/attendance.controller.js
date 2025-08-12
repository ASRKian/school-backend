import Attendance from "../../models/attendance.model.js";
import Batch from "../../models/batch.model.js";
import User from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addAttendance = asyncHandler(async (req, res) => {
    const { batchId, students, day } = req.body;

    const isValidBatch = await Batch.findOne({ uniqueId: batchId });
    if (!isValidBatch) {
        throw new ApiError({ statusCode: 400, error: "Invalid batchId" })
    };

    const foundStudents = await User.find({ uniqueId: { $in: students } }, { uniqueId: 1 });
    if (foundStudents.length !== students.length) {
        const foundIds = foundStudents.map(s => s.uniqueId);
        const missingIds = students.filter(id => !foundIds.includes(id));
        throw new ApiError({ statusCode: 400, error: `Students not found: ${missingIds.join(", ")}` });
    }

    await Attendance.create(req.body);
    return res.status(201).json(new ApiResponse({ statusCode: 201, message: "Attendance added successfully" }));
});

export const getAttendance = asyncHandler(async (req, res) => {
    const { batchId } = req.query;

    const pipeline = [
        {
            $match: { batchId }
        },
        {
            $lookup: {
                from: "users",
                let: { studentIds: "$students" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $in: ["$uniqueId", "$$studentIds"]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            fullName: 1,
                            uniqueId: 1,
                            email: 1,
                            avatar: 1
                        }
                    }
                ],
                as: "students"
            }
        },
        {
            $project: {
                updatedAt: 0,
                createdAt: 0
            }
        }
    ]

    const attendance = await Attendance.aggregate(pipeline);
    return res.status(200).json(new ApiResponse({ statusCode: 200, data: attendance, totalDocs: attendance.length }));
});

export const modifyAttendance = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { students } = req.body;

    const attendance = await Attendance.findByIdAndUpdate(id, { students }, { new: true }).select("-createdAt -updatedAt");

    if (!attendance) {
        throw new ApiError({ statusCode: 404, message: "Attendance not found" });
    }

    return res.status(200).json(new ApiResponse({ statusCode: 200, data: attendance, message: "Attendance updated successfully" }));
});