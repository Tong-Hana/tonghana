import { PrismaClient } from "@prisma/client";

const globalForReplica = globalThis as unknown as {
  replicaPrisma: PrismaClient | undefined;
};

export const replicaPrisma =
  globalForReplica.replicaPrisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.READ_REPLICA_URL,
      },
    },
    log: ["query", "error"],
  });

if (process.env.NODE_ENV !== "production")
  globalForReplica.replicaPrisma = replicaPrisma;
