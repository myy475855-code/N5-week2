import { ApplicationStatus, Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import { HttpError } from "../middleware/error";

const include = {
  student: { select: { id: true, name: true, email: true } },
  internship: {
    select: { id: true, title: true, location: true, company: { select: { id: true, name: true } } },
  },
} satisfies Prisma.ApplicationInclude;

export const applicationService = {
  list: (f: { studentId?: number; internshipId?: number; status?: ApplicationStatus } = {}) =>
    prisma.application.findMany({ where: f, include, orderBy: { appliedAt: "desc" } }),

  async get(id: number) {
    const row = await prisma.application.findUnique({ where: { id }, include });
    if (!row) throw new HttpError(404, "Application not found");
    return row;
  },

  // Duplicate (student, internship) pairs are rejected by the DB unique index
  // -> Prisma P2002 -> 409 via the error middleware.
  create: (studentId: number, internshipId: number) =>
    prisma.application.create({ data: { studentId, internshipId }, include }),

  updateStatus: (id: number, status: ApplicationStatus) =>
    prisma.application.update({ where: { id }, data: { status }, include }),

  remove: (id: number) => prisma.application.delete({ where: { id } }),
};
