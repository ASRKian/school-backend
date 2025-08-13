import mongoose from "mongoose";
import Batch from "../../models/batch.model.js";
import User from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import Exam from "../../models/exam.model.js";
import Attendance from "../../models/attendance.model.js";
import Report from "../../models/report.model.js";

export const getBatches = asyncHandler(async (_, res) => {
    const batches = await Batch.find().select("-createdAt -updatedAt -subjects -totalFee");

    const data = {};

    batches.forEach(batch => {
        const splittedData = batch.uniqueId.split(":");
        const year = splittedData?.[1];

        const stdSec = splittedData?.[0] || "";
        const standard = stdSec.slice(0, stdSec.length - 1);
        const section = stdSec.slice(stdSec.length - 1);

        if (!data[year]) data[year] = {};

        if (!data[year][standard]) data[year][standard] = [];

        data[year][standard].push({ [section]: batch._id });
    });

    return res.status(200).json(new ApiResponse({ statusCode: 200, data, message: "Batches fetched successfully" }));
});

export const getBatchById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const batch = await Batch.findById(id);
    if (!batch) {
        return res.status(404).json(new ApiError({ statusCode: 404, error: "Batch not found" }));
    }
    return res.status(200).json(new ApiResponse({ statusCode: 200, data: batch, message: "Batch fetched successfully" }));
});

export const addBatch = asyncHandler(async (req, res) => {
    const { standard, section = "A", year, subjects, totalFee } = req.body;
    const uniqueId = `${standard}${section}:${year}`;
    await Batch.create({ uniqueId, subjects, totalFee });
    return res.status(201).json(new ApiResponse({ statusCode: 201, message: "Batch created successfully" }));
});

export const updateBatch = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { standard, year, section = "A", subjects, totalFee } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const batch = await Batch.findById(id).session(session);

        if (!batch) {
            throw new ApiError({ statusCode: 404, error: "Invalid batch id" });
        }

        const oldBatchUniqueId = batch.uniqueId;
        let newBatchUniqueId = `${standard}${section}:${year}`;

        const isExamsConducted = await Exam.findOne({ batchId: oldBatchUniqueId });
        console.log("🚀 ~ :50 ~ isExamsConducted:", isExamsConducted);
        if (isExamsConducted) newBatchUniqueId = oldBatchUniqueId;

        batch.uniqueId = newBatchUniqueId;
        batch.totalFee = totalFee;
        if (subjects) {
            batch.subjects = subjects;
        }
        await batch.save({ session });

        await User.updateMany(
            { batch: oldBatchUniqueId },
            [
                {
                    $set: {
                        batch: newBatchUniqueId,
                        amountDue: {
                            $cond: [
                                { $gt: [totalFee, { $add: ["$amountPaid", "$amountDue"] }] },
                                { $add: ["$amountDue", { $subtract: [totalFee, { $add: ["$amountPaid", "$amountDue"] }] }] },
                                { $max: [{ $subtract: ["$amountDue", { $subtract: [{ $add: ["$amountPaid", "$amountDue"] }, totalFee] }] }, 0] }
                            ]
                        }
                    }
                }
            ],
            { session }
        );

        await Exam.updateMany(
            { batchId: oldBatchUniqueId },
            { $set: { batchId: newBatchUniqueId } },
            { session }
        );

        await Attendance.updateMany(
            { batchId: oldBatchUniqueId },
            { $set: { batchId: newBatchUniqueId } },
            { session }
        );

        await Report.updateMany(
            { batchId: oldBatchUniqueId },
            { $set: { batchId: newBatchUniqueId } },
            { session }
        );

        await session.commitTransaction();

        return res.status(200).json(
            new ApiResponse({
                statusCode: 200,
                message: "Batch and related users updated successfully"
            })
        );
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});


export const deleteBatch = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Batch.findByIdAndDelete(id);
    return res.status(200).json(new ApiResponse({ statusCode: 200, message: "Batch deleted successfully" }));
});