import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Busca as configurações do evento ou cria uma padrão
    let eventSettings = await prisma.eventSettings.findFirst();

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

    return NextResponse.json({
      success: true,
      data: eventSettings,
    });
  } catch (error) {
    console.error("Erro ao buscar configurações do evento:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

