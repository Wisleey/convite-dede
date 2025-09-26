// scripts/update-event-date.ts
import { prisma } from "../lib/prisma";

async function updateEventDate() {
  try {
    // Atualiza a data do evento para 2025
    const updatedSettings = await prisma.eventSettings.updateMany({
      data: {
        eventDate: new Date("2025-11-01T16:30:00-03:00"),
        eventName: "Aniversário de Dedé Sales - 50 Anos",
      },
    });

    console.log("✅ Data do evento atualizada com sucesso para 2025!");
    console.log(`📊 ${updatedSettings.count} registro(s) atualizado(s)`);

    // Verifica a atualização
    const currentSettings = await prisma.eventSettings.findFirst();
    if (currentSettings) {
      console.log("📅 Nova data do evento:", currentSettings.eventDate);
      console.log("🎉 Nome do evento:", currentSettings.eventName);
      console.log("📍 Local:", currentSettings.location);
    }
  } catch (error) {
    console.error("❌ Erro ao atualizar data do evento:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executa o script
updateEventDate();

// ============================================
// scripts/init-event-date.ts (exemplo de como deve ficar)
// ============================================

// REMOVA esta linha que está causando o conflito:
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// SUBSTITUA por:
// import { prisma } from "../src/lib/prisma";

// async function initEventDate() {
//   try {
//     // Seu código aqui...
//     const result = await prisma.eventSettings.create({
//       data: {
//         eventDate: new Date("2025-11-01T16:30:00-03:00"),
//         eventName: "Aniversário de Dedé Sales - 50 Anos",
//         location: "Local do evento"
//       }
//     });
//
//     console.log("✅ Evento inicializado:", result);
//   } catch (error) {
//     console.error("❌ Erro:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }
//
// initEventDate();

// ============================================
// Alternativa: Script utilitário reutilizável
// ============================================

// scripts/database-utils.ts
export async function createOrUpdateEventSettings(data: {
  eventDate: Date;
  eventName: string;
  location?: string;
}) {
  const { prisma } = await import("../lib/prisma");

  try {
    // Tenta atualizar primeiro
    const existing = await prisma.eventSettings.findFirst();

    if (existing) {
      const updated = await prisma.eventSettings.update({
        where: { id: existing.id },
        data,
      });
      console.log("✅ Configurações do evento atualizadas:", updated);
      return updated;
    } else {
      const created = await prisma.eventSettings.create({ data });
      console.log("✅ Configurações do evento criadas:", created);
      return created;
    }
  } catch (error) {
    console.error("❌ Erro ao gerenciar configurações do evento:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

