import Attendance from "../../models/attendance.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getAttendance = asyncHandler(async (req, res) => {
    const uniqueId = req.user.uniqueId;
    const batchId = req.user.batch;

    const attendance = await Attendance.find({ students: uniqueId, batchId });
    if (!attendance.length) {
        throw new ApiError({ statusCode: 404, error: "no attendance found" })
    }

    const presentDays = new Set();
    attendance.forEach((data) => {
        presentDays.add(data.day.toDateString())
    })

    return res.json(new ApiResponse({ statusCode: 200, data: [...presentDays] }))
})