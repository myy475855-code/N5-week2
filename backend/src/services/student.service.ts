import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import { HttpError } from "../middleware/error";

const include = { skills: { include: { skill: true } } } satisfies Prisma.StudentInclude;
type StudentRow = Prisma.StudentGetPayload<{ include: typeof include }>;

const shape = ({ skills, ...rest }: StudentRow) => ({
  ...rest,
  skills: skills.map((s) => s.skill.name).sort(),
});

const skillLinks = (names: string[]) =>
  names.map((name) => ({ skill: { connectOrCreate: { where: { name }, create: { name } } } }));

export interface StudentInput {
  name: string;
  email: string;
  university?: string;
  skills?: string[];
}

export const studentService = {
  async list() {
    return (await prisma.student.findMany({ include, orderBy: { name: "asc" } })).map(shape);
  },

  async get(id: number) {
    const row = await prisma.student.findUnique({ where: { id }, include });
    if (!row) throw new HttpError(404, "Student not found");
    return shape(row);
  },

  async create({ skills = [], ...data }: StudentInput) {
    return shape(
      await prisma.student.create({ data: { ...data, skills: { create: skillLinks(skills) } }, include }),
    );
  },

  async update(id: number, { skills, ...data }: Partial<StudentInput>) {
    return shape(
      await prisma.student.update({
        where: { id },
        data: { ...data, ...(skills && { skills: { deleteMany: {}, create: skillLinks(skills) } }) },
        include,
      }),
    );
  },

  remove: (id: number) => prisma.student.delete({ where: { id } }),
};
