import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/admin/user.routes.js";
import { errors } from "celebrate";
import { ApiError } from "./utils/ApiError.js";
import ErrorMiddleware from "./middlewares/ErrorMiddleware.js";
import batchRoutes from "./routes/admin/batch.route.js";
import attendanceRoutes from "./routes/admin/attendance.route.js";

const app = express();

// Middleware for CORS
const corsOptions = {
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
};
// app.use(cors());
app.use(cors(corsOptions));

// Middleware for parsing requests
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

// ADMIN panel routes
app.use("/apiAdmin/v1/user/", userRoutes);
app.use("/apiAdmin/v1/batch/", batchRoutes);
app.use("/apiAdmin/v1/attendance/", attendanceRoutes);

// Catch-all for undefined routes
app.all("*", (req, res, next) => {
    next(new ApiError({ statusCode: 404, error: `Not Available Path ${req.baseUrl} !` }));
});

// Error handling
app.use(errors());
app.use(ErrorMiddleware);

export default app;