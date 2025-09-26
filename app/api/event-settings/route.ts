import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Verifica se estamos em build time (sem DATABASE_URL)
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        data: {
          id: 1,
          eventName: "Aniversário de Dedé Sales",
          eventDate: new Date("2025-11-01T16:30:00-03:00"),
          location: "Praia de Jacumã, Conde - PB",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // Tenta buscar as configurações do evento com proteção extra
    let eventSettings;
    try {
      eventSettings = await prisma.eventSettings.findFirst();

      if (!eventSettings) {
        // Cria configuração padrão se não existir
        eventSettings = await prisma.eventSettings.create({
          data: {
            eventName: "Aniversário de Dedé Sales",
            eventDate: new Date("2025-11-01T16:30:00-03:00"), // Data fixa do evento
            location: "Praia de Jacumã, Conde - PB",
          },
        });
      }
    } catch (dbError) {
      console.error("Erro específico do banco:", dbError);
      // Retorna dados padrão se houver erro de banco
      eventSettings = {
        id: 1,
        eventName: "Aniversário de Dedé Sales",
        eventDate: new Date("2025-11-01T16:30:00-03:00"),
        location: "Praia de Jacumã, Conde - PB",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return NextResponse.json({
      success: true,
      data: eventSettings,
    });
  } catch (error) {
    console.error("Erro ao buscar configurações do evento:", error);

    // Em caso de erro, retorna dados padrão para não quebrar o build
    return NextResponse.json({
      success: true,
      data: {
        id: 1,
        eventName: "Aniversário de Dedé Sales",
        eventDate: new Date("2025-11-01T16:30:00-03:00"),
        location: "Praia de Jacumã, Conde - PB",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verifica se estamos em build time (sem DATABASE_URL)
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "Banco de dados não disponível durante o build",
        },
        { status: 503 }
      );
    }

    const { eventDate, eventName, location } = await request.json();

    // Atualiza ou cria as configurações do evento
    const eventSettings = await prisma.eventSettings.upsert({
      where: { id: 1 }, // Sempre usa o primeiro registro
      update: {
        eventDate: new Date(eventDate),
        eventName,
        location,
      },
      create: {
        eventDate: new Date(eventDate),
        eventName,
        location,
      },
    });

    return NextResponse.json({
      success: true,
      data: eventSettings,
    });
  } catch (error) {
    console.error("Erro ao salvar configurações do evento:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
