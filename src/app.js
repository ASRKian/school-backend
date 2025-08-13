import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminUserRoutes from "./routes/admin/user.route.js";
import { errors } from "celebrate";
import { ApiError } from "./utils/ApiError.js";
import ErrorMiddleware from "./middlewares/ErrorMiddleware.js";
import batchRoutes from "./routes/admin/batch.route.js";
import attendanceRoutes from "./routes/admin/attendance.route.js";
import reportRoutes from "./routes/admin/report.route.js";
import userRoutes from "./routes/user/user.route.js";
import userAttendanceRoutes from "./routes/user/attendance.route.js";
import userReportRoutes from "./routes/user/report.route.js";
import examRoutes from "./routes/admin/exam.route.js";
import userExamRoutes from "./routes/user/exam.route.js";
import transactionRoutes from "./routes/user/transaction.route.js";
import teacherAttendanceRoutes from "./routes/teacher/attendance.route.js";
import subjectsTimeTableRoutes from "./routes/admin/subjects.timetable.route.js";
import userSubjectsTimeTableRoutes from "./routes/user/subjects.timetable.route.js";

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
app.use("/apiAdmin/v1/user/", adminUserRoutes);
app.use("/apiAdmin/v1/batch/", batchRoutes);
app.use("/apiAdmin/v1/attendance/", attendanceRoutes);
app.use("/apiAdmin/v1/report/", reportRoutes);
app.use("/apiAdmin/v1/exam/", examRoutes);
app.use("/apiAdmin/v1/subjects-timetable/", subjectsTimeTableRoutes);

// Teacher panel routes
app.use("/apiTeacher/v1/attendance/", teacherAttendanceRoutes);

// USER panel routes
app.use("/apiUser/v1/user/", userRoutes);
app.use("/apiUser/v1/attendance/", userAttendanceRoutes);
app.use("/apiUser/v1/report/", userReportRoutes);
app.use("/apiUser/v1/exam/", userExamRoutes);
app.use("/apiUser/v1/transaction/", transactionRoutes);
app.use("/apiUser/v1/subjects-timetable/", userSubjectsTimeTableRoutes);

// Catch-all for undefined routes
app.all("*", (req, res, next) => {
    next(new ApiError({ statusCode: 404, error: `Not Available Path ${req.baseUrl} !` }));
});

// Error handling
app.use(errors());
app.use(ErrorMiddleware);

export default app;