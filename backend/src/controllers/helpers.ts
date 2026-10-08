import { z } from "zod";
export const idParam = (v: unknown) => z.coerce.number().int().positive().parse(v);
