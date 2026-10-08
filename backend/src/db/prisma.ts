import { PrismaClient } from "@prisma/client";

// Single shared client (avoids exhausting connections during dev reloads).
const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = prisma;
