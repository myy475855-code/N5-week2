import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import { HttpError } from "../middleware/error";

// One `include` = Prisma fetches internships, then ALL their companies and skills
// in batched queries (a fixed number of queries regardless of row count) -> no N+1.
const include = {
  company: { select: { id: true, name: true, website: true } },
  skills: { include: { skill: true } },
} satisfies Prisma.InternshipInclude;

type InternshipRow = Prisma.InternshipGetPayload<{ include: typeof include }>;

// requiredSkills is exposed as a flat string array.
const shape = ({ skills, ...rest }: InternshipRow) => ({
  ...rest,
  requiredSkills: skills.map((s) => s.skill.name).sort(),
});

const skillLinks = (names: string[]) =>
  names.map((name) => ({ skill: { connectOrCreate: { where: { name }, create: { name } } } }));

export interface InternshipFilters {
  location?: string;
  companyId?: number;
  skill?: string;
  q?: string;
}

export interface InternshipInput {
  companyId: number;
  title: string;
  description: string;
  location: string;
  isRemote?: boolean;
  deadline?: Date | null;
  requiredSkills?: string[];
}

export const internshipService = {
  async list(f: InternshipFilters = {}) {
    const where: Prisma.InternshipWhereInput = {
      ...(f.location && { location: { contains: f.location, mode: "insensitive" } }),
      ...(f.companyId && { companyId: f.companyId }),
      ...(f.skill && { skills: { some: { skill: { name: { equals: f.skill, mode: "insensitive" } } } } }),
      ...(f.q && {
        OR: [
          { title: { contains: f.q, mode: "insensitive" } },
          { description: { contains: f.q, mode: "insensitive" } },
        ],
      }),
    };
    const rows = await prisma.internship.findMany({ where, include, orderBy: { createdAt: "desc" } });
    return rows.map(shape);
  },

  async get(id: number) {
    const row = await prisma.internship.findUnique({ where: { id }, include });
    if (!row) throw new HttpError(404, "Internship not found");
    return shape(row);
  },

  async create({ requiredSkills = [], ...data }: InternshipInput) {
    const row = await prisma.internship.create({
      data: { ...data, skills: { create: skillLinks(requiredSkills) } },
      include,
    });
    return shape(row);
  },

  async update(id: number, { requiredSkills, ...data }: Partial<InternshipInput>) {
    const row = await prisma.internship.update({
      where: { id },
      data: {
        ...data,
        ...(requiredSkills && { skills: { deleteMany: {}, create: skillLinks(requiredSkills) } }),
      },
      include,
    });
    return shape(row);
  },

  remove: (id: number) => prisma.internship.delete({ where: { id } }),
};
