import { Router } from "express";
import { skillController } from "../controllers/skill.controller";

const r = Router();
r.get("/", skillController.list);
r.post("/", skillController.create);
r.delete("/:id", skillController.remove);
export default r;
