import { Router } from "express";
import { companyController } from "../controllers/company.controller";

const r = Router();
r.get("/", companyController.list);
r.get("/:id", companyController.get);
r.post("/", companyController.create);
r.put("/:id", companyController.update);
r.delete("/:id", companyController.remove);
export default r;
