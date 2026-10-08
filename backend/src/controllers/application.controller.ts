import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";
import { asyncHandler } from "../middleware/error";
import { applicationService } from "../services/application.service";
import { idParam } from "./helpers";

const status = z.nativeEnum(ApplicationStatus);
const createBody = z.object({
  studentId: z.number().int().positive(),
  internshipId: z.number().int().positive(),
});
const query = z.object({
  studentId: z.coerce.number().int().positive().optional(),
  internshipId: z.coerce.number().int().positive().optional(),
  status: status.optional(),
});

export const applicationController = {
  list: asyncHandler(async (req, res) => void res.json(await applicationService.list(query.parse(req.query)))),
  get: asyncHandler(async (req, res) => void res.json(await applicationService.get(idParam(req.params.id)))),
  create: asyncHandler(async (req, res) => {
    const { studentId, internshipId } = createBody.parse(req.body);
    res.status(201).json(await applicationService.create(studentId, internshipId));
  }),
  updateStatus: asyncHandler(async (req, res) => {
    const { status: s } = z.object({ status }).parse(req.body);
    res.json(await applicationService.updateStatus(idParam(req.params.id), s));
  }),
  remove: asyncHandler(async (req, res) => {
    await applicationService.remove(idParam(req.params.id));
    res.status(204).end();
  }),
};
