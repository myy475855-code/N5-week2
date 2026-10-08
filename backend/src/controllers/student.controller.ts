import { z } from "zod";
import { asyncHandler } from "../middleware/error";
import { studentService } from "../services/student.service";
import { idParam } from "./helpers";

const body = z.object({
  name: z.string().trim().min(1),
  email: z.string().email(),
  university: z.string().trim().optional(),
  skills: z.array(z.string().trim().min(1)).optional(),
});

export const studentController = {
  list: asyncHandler(async (_req, res) => void res.json(await studentService.list())),
  get: asyncHandler(async (req, res) => void res.json(await studentService.get(idParam(req.params.id)))),
  create: asyncHandler(async (req, res) => void res.status(201).json(await studentService.create(body.parse(req.body)))),
  update: asyncHandler(async (req, res) =>
    void res.json(await studentService.update(idParam(req.params.id), body.partial().parse(req.body)))),
  remove: asyncHandler(async (req, res) => {
    await studentService.remove(idParam(req.params.id));
    res.status(204).end();
  }),
};
