const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function initializeEventDate() {
  try {
    // Verifica se já existe uma configuração do evento
    const existingSettings = await prisma.eventSettings.findFirst();

    if (!existingSettings) {
      // Cria a configuração inicial do evento
      const eventSettings = await prisma.eventSettings.create({
        data: {
          eventName: "Aniversário de Dedé Sales - 50 Anos",
          eventDate: new Date("2025-11-01T16:30:00-03:00"), // Data fixa do aniversário
          location: "Praia de Jacumã, Conde - PB",
        },
      });

      console.log("✅ Configuração do evento criada com sucesso!");
      console.log("📅 Data do evento:", eventSettings.eventDate);
      console.log("📍 Local:", eventSettings.location);
    } else {
      console.log("ℹ️ Configuração do evento já existe:");
      console.log("📅 Data do evento:", existingSettings.eventDate);
      console.log("📍 Local:", existingSettings.location);
    }
  } catch (error) {
    console.error("❌ Erro ao inicializar configuração do evento:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executa o script
initializeEventDate();
