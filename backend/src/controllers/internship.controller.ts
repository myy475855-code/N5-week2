import { z } from "zod";
import { asyncHandler } from "../middleware/error";
import { internshipService } from "../services/internship.service";
import { idParam } from "./helpers";

const body = z.object({
  companyId: z.number().int().positive(),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  location: z.string().trim().min(1),
  isRemote: z.boolean().optional(),
  deadline: z.coerce.date().nullable().optional(),
  requiredSkills: z.array(z.string().trim().min(1)).optional(),
});

const query = z.object({
  location: z.string().optional(),
  companyId: z.coerce.number().int().positive().optional(),
  skill: z.string().optional(),
  q: z.string().optional(),
});

export const internshipController = {
  list: asyncHandler(async (req, res) => void res.json(await internshipService.list(query.parse(req.query)))),
  get: asyncHandler(async (req, res) => void res.json(await internshipService.get(idParam(req.params.id)))),
  create: asyncHandler(async (req, res) =>
    void res.status(201).json(await internshipService.create(body.parse(req.body)))),
  update: asyncHandler(async (req, res) =>
    void res.json(await internshipService.update(idParam(req.params.id), body.partial().parse(req.body)))),
  remove: asyncHandler(async (req, res) => {
    await internshipService.remove(idParam(req.params.id));
    res.status(204).end();
  }),
};
