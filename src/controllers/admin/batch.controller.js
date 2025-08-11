import Batch from "../../models/batch.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getBatches = asyncHandler(async (_, res) => {
    const batches = await Batch.find().select("-createdAt -updatedAt");
    return res.status(200).json(new ApiResponse({ statusCode: 200, data: batches, message: "Batches fetched successfully" }));
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
    const { standard, section = "A", year, subjects } = req.body;
    const uniqueId = `${standard}${section}:${year}`;
    await Batch.create({ uniqueId, subjects });
    return res.status(201).json(new ApiResponse({ statusCode: 201, message: "Batch created successfully" }));
});

export const updateBatch = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Batch.findByIdAndUpdate(id, req.body);
    return res.status(200).json(new ApiResponse({ statusCode: 200, message: "Batch updated successfully" }));
});

export const deleteBatch = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Batch.findByIdAndDelete(id);
    return res.status(200).json(new ApiResponse({ statusCode: 200, message: "Batch deleted successfully" }));
});