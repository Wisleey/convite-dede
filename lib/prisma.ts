// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // evita criar múltiplas instâncias em dev (HMR)
  // eslint-disable-next-line no-var
  var __globalPrisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__globalPrisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__globalPrisma = prisma;
}

// Alternativa 2 - Usando namespace para evitar conflitos:
/*
declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient | undefined;
    }
  }
}

export const prisma =
  (global as any).prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  (global as any).prisma = prisma;
}
*/
