import { PrismaClient } from "@prisma/client";

// Prevent multiple PrismaClient instances during ts-node-dev hot reloads,
// which otherwise exhausts the MySQL connection pool.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
