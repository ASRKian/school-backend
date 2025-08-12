import Report from "../../models/report.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getReports = asyncHandler(async (req, res) => {
    const uniqueId = req.user.uniqueId;
    const batchId = req.user.batch;
    const query = { uniqueId: new RegExp(`${batchId}\\|${uniqueId}`) };

    const reports = await Report.find(query).select("-examType -studentId -createdAt -updatedAt");
    if (!reports.length) {
        throw new ApiError({ statusCode: 404, error: "No reports found" });
    }

    return res.json(new ApiResponse({ statusCode: 200, data: reports }));
});
