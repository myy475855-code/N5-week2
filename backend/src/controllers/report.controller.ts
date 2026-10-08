import { asyncHandler } from "../middleware/error";
import { reportService } from "../services/report.service";
import { idParam } from "./helpers";

export const reportController = {
  topCompanies: asyncHandler(async (_req, res) => void res.json(await reportService.topCompanies())),
  skillMatches: asyncHandler(async (req, res) =>
    void res.json(await reportService.skillMatches(idParam(req.params.internshipId)))),
};
