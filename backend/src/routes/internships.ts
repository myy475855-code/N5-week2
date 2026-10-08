import { Router } from "express";
import { internshipController } from "../controllers/internship.controller";

const r = Router();
r.get("/", internshipController.list);
r.get("/:id", internshipController.get);
r.post("/", internshipController.create);
r.put("/:id", internshipController.update);
r.delete("/:id", internshipController.remove);
export default r;
