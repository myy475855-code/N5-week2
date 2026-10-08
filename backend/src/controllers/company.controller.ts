import { z } from "zod";
import { asyncHandler } from "../middleware/error";
import { companyService } from "../services/company.service";
import { idParam } from "./helpers";

const body = z.object({ name: z.string().trim().min(1), website: z.string().url().optional() });

export const companyController = {
  list: asyncHandler(async (_req, res) => void res.json(await companyService.list())),
  get: asyncHandler(async (req, res) => void res.json(await companyService.get(idParam(req.params.id)))),
  create: asyncHandler(async (req, res) => void res.status(201).json(await companyService.create(body.parse(req.body)))),
  update: asyncHandler(async (req, res) =>
    void res.json(await companyService.update(idParam(req.params.id), body.partial().parse(req.body)))),
  remove: asyncHandler(async (req, res) => {
    await companyService.remove(idParam(req.params.id));
    res.status(204).end();
  }),
};
