import { Router } from "express";
import { applicationController } from "../controllers/application.controller";

const r = Router();
r.get("/", applicationController.list);
r.get("/:id", applicationController.get);
r.post("/", applicationController.create);
r.patch("/:id/status", applicationController.updateStatus);
r.delete("/:id", applicationController.remove);
export default r;
