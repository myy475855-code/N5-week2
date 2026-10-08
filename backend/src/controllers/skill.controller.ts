import { z } from "zod";
import { asyncHandler } from "../middleware/error";
import { skillService } from "../services/skill.service";
import { idParam } from "./helpers";

export const skillController = {
  list: asyncHandler(async (_req, res) => void res.json(await skillService.list())),
  create: asyncHandler(async (req, res) => {
    const { name } = z.object({ name: z.string().trim().min(1) }).parse(req.body);
    res.status(201).json(await skillService.create(name));
  }),
  remove: asyncHandler(async (req, res) => {
    await skillService.remove(idParam(req.params.id));
    res.status(204).end();
  }),
};
