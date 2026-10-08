import { prisma } from "../db/prisma";
import { HttpError } from "../middleware/error";

export const companyService = {
  list: () =>
    prisma.company.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { internships: true } } }, // one query, no N+1
    }),

  async get(id: number) {
    const company = await prisma.company.findUnique({
      where: { id },
      include: { internships: { orderBy: { createdAt: "desc" } } },
    });
    if (!company) throw new HttpError(404, "Company not found");
    return company;
  },

  create: (data: { name: string; website?: string }) => prisma.company.create({ data }),

  update: (id: number, data: { name?: string; website?: string }) =>
    prisma.company.update({ where: { id }, data }),

  remove: (id: number) => prisma.company.delete({ where: { id } }),
};
