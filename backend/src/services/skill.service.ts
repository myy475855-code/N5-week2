import { prisma } from "../db/prisma";

export const skillService = {
  list: () => prisma.skill.findMany({ orderBy: { name: "asc" } }),
  create: (name: string) => prisma.skill.create({ data: { name } }),
  remove: (id: number) => prisma.skill.delete({ where: { id } }),
};
