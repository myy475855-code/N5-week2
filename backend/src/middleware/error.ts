import { NextFunction, Request, RequestHandler, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next) =>
    fn(req, res).catch(next);

export const notFound = (_req: Request, _res: Response, next: NextFunction) =>
  next(new HttpError(404, "Route not found"));

// Translates Prisma / validation errors into JSON error responses.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
  if (err instanceof ZodError)
    return res.status(400).json({ error: "Validation failed", details: err.flatten().fieldErrors });
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") return res.status(409).json({ error: "Already exists (unique constraint)" });
    if (err.code === "P2025") return res.status(404).json({ error: "Record not found" });
    if (err.code === "P2003") return res.status(400).json({ error: "Referenced record does not exist" });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
}
