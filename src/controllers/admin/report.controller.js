import mongoose from "mongoose";
import ReportModel from "../../models/report.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import User from "../../models/user.model.js";
import Exam from "../../models/exam.model.js";

export const addReport = asyncHandler(async (req, res) => {
    const { examType, subjects, studentId, status, marks, grade, rank } = req.body;

    const isValidStudent = await User.findOne({ uniqueId: studentId, role: "STUDENT" });

    if (!isValidStudent) {
        throw new ApiError({ statusCode: 400, error: "Invalid studentId" });
    }

    const isValidExamId = await Exam.findOne({ type: examType, batchId: isValidStudent.batch });

    if (!isValidExamId) {
        throw new ApiError({ statusCode: 400, error: "exam not found for the given student" });
    }

    const report = Object.fromEntries(
        subjects.map((subject, i) => [
            subject,
            { marks: marks[i], grade: grade[i], rank: rank[i] }
        ])
    );

    const batchId = isValidStudent.batch;
    const uniqueId = `${examType}|${batchId}|${studentId}`;
    await ReportModel.create({ examType, batchId, report, studentId, uniqueId, status });
    return res.status(201).json(new ApiResponse({ statusCode: 201, message: "Report added successfully" }))

});

export const getReports = asyncHandler(async (req, res) => {
    const { batchId, studentId } = req.query;
    const query = {};

    if (batchId) query.batchId = batchId
    if (studentId) query.studentId = studentId;

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
    const uniqueId = req.params.uniqueId;
    const studentUniqueId = uniqueId.split("|")?.[2];
    if (req.user.role === "STUDENT" && studentUniqueId !== req.user.uniqueId) {
        throw new ApiError({ statusCode: 403, error: "Students can only access their own data" })
    }

    const report = await ReportModel.findOne({ uniqueId }).select("-examType -batchId -studentId");
    if (!report) {
        return res.status(404).json(new ApiResponse({ statusCode: 404, message: "Report not found" }));
    }
    return res.status(200).json(new ApiResponse({ statusCode: 200, data: report }));
});

export const updateReport = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { subjectName, newMarks, newGrade, newRank, status } = req.body;
    await ReportModel.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        {
            $set: {
                [`report.${subjectName}`]: { marks: newMarks, grade: newGrade, rank: newRank },
                status
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