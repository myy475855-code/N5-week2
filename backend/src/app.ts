import cors from "cors";
import express from "express";
import { errorHandler, notFound } from "./middleware/error";
import companies from "./routes/companies";
import internships from "./routes/internships";
import students from "./routes/students";
import applications from "./routes/applications";
import skills from "./routes/skills";
import reports from "./routes/reports";

export const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/companies", companies);
app.use("/api/internships", internships);
app.use("/api/students", students);
app.use("/api/applications", applications);
app.use("/api/skills", skills);
app.use("/api/reports", reports);

app.use(notFound);
app.use(errorHandler);
