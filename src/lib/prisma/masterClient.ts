import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  masterPrisma: PrismaClient | undefined;
};

export const masterPrisma =
  globalForPrisma.masterPrisma ??
  new PrismaClient({
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production")
  globalForPrisma.masterPrisma = masterPrisma;
