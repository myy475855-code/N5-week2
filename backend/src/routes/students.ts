import { Router } from "express";
import { studentController } from "../controllers/student.controller";

const r = Router();
r.get("/", studentController.list);
r.get("/:id", studentController.get);
r.post("/", studentController.create);
r.put("/:id", studentController.update);
r.delete("/:id", studentController.remove);
export default r;
