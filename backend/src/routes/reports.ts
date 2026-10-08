import { Router } from "express";
import { reportController } from "../controllers/report.controller";

const r = Router();
r.get("/top-companies", reportController.topCompanies);
r.get("/internships/:internshipId/matches", reportController.skillMatches);
export default r;
