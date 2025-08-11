import mongoose from "mongoose";
import ReportModel from "../../models/report.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addReport = asyncHandler(async (req, res) => {
    const { examType, batchId, subjects, studentId, status, marks, grade, rank } = req.body;

    const report = Object.fromEntries(
        subjects.map((subject, i) => [
            subject,
            { marks: marks[i], grade: grade[i], rank: rank[i] }
        ])
    );

    const uniqueId = `${examType}|${batchId}|${studentId}`;
    await ReportModel.create({ examType, batchId, report, studentId, uniqueId, status });
    return res.status(201).json(new ApiResponse({ statusCode: 201, message: "Report added successfully" }))

});

export const getReports = asyncHandler(async (req, res) => {
    const query = {};

    if (req.query.studentId) {
        query.studentId = req.query.studentId;
    }

    const reports = await ReportModel.find(query).select("-examType -batchId -studentId");

    if (reports.length === 0) {
        return res.status(404).json(
            new ApiResponse({
                statusCode: 404,
                message: query.studentId
                    ? "No reports found for this student"
                    : "No reports found"
            })
        );
    }

    return res.status(200).json(
        new ApiResponse({
            statusCode: 200,
            data: reports
        })
    );
});

export const getReportById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const report = await ReportModel.findById(id).select("-examType -batchId -studentId");
    if (!report) {
        return res.status(404).json(new ApiResponse({ statusCode: 404, message: "Report not found" }));
    }
    return res.status(200).json(new ApiResponse({ statusCode: 200, data: report }));
});

export const updateReport = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { subjectName, newMarks, newGrade, newRank } = req.body;
    await ReportModel.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        {
            $set: {
                [`report.${subjectName}`]: { marks: newMarks, grade: newGrade, rank: newRank }
            }
        }
    );

    return res.status(204).end();
});

export const deleteReport = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const report = await ReportModel.findByIdAndDelete(id);
    if (!report) {
        return res.status(404).json(new ApiResponse({ statusCode: 404, message: "Report not found" }));
    }
    return res.status(204).end();
})