// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // evita criar múltiplas instâncias em dev (HMR)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
