// app/api/videos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Buscar todos os vídeos ativos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const bandType = searchParams.get("bandType");

    // Construir filtros
    const where: any = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    if (bandType) {
      where.bandType = bandType.toUpperCase();
    }

    const videos = await prisma.video.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      include: {
        eventSettings: {
          select: {
            eventName: true,
            eventDate: true,
            location: true,
          },
        },
      },
    });

    // Mapear para o formato esperado pelo frontend
    const mappedVideos = videos.map((video) => ({
      id: video.id.toString(),
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      bandType: video.bandType.toLowerCase(),
      isActive: video.isActive,
      order: video.displayOrder,
      duration: video.duration,
      fileSize: video.fileSize ? Number(video.fileSize) : null,
      mimeType: video.mimeType,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
      eventSettings: video.eventSettings,
    }));

    return NextResponse.json(mappedVideos);
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// POST - Criar novo vídeo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      bandType,
      displayOrder,
      isActive = true,
      eventSettingsId,
    } = body;

    // Validações
    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: "Título e URL do vídeo são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o tipo de banda é válido
    const validBandTypes = [
      "PRINCIPAL",
      "ESPECIAL",
      "ABERTURA",
      "ENCERRAMENTO",
    ];
    const bandTypeUpper = bandType?.toUpperCase();

    if (bandTypeUpper && !validBandTypes.includes(bandTypeUpper)) {
      return NextResponse.json(
        { error: "Tipo de banda inválido" },
        { status: 400 }
      );
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl,
        thumbnailUrl,
        bandType: bandTypeUpper || "PRINCIPAL",
        displayOrder: displayOrder || 0,
        isActive,
        eventSettingsId: eventSettingsId ? parseInt(eventSettingsId) : null,
      },
      include: {
        eventSettings: {
          select: {
            eventName: true,
            eventDate: true,
            location: true,
          },
        },
      },
    });

    // Mapear resposta
    const mappedVideo = {
      id: video.id.toString(),
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      bandType: video.bandType.toLowerCase(),
      isActive: video.isActive,
      order: video.displayOrder,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
      eventSettings: video.eventSettings,
    };

    return NextResponse.json(mappedVideo, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar vídeo:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// PUT - Atualizar configuração de vídeos (ativar/desativar em lote)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, videoIds, bandType } = body;

    if (action === "toggleActive" && videoIds && Array.isArray(videoIds)) {
      // Ativar/desativar vídeos específicos
      const updatedVideos = await Promise.all(
        videoIds.map(async (id: string) => {
          return await prisma.video.update({
            where: { id: parseInt(id) },
            data: { isActive: body.isActive },
          });
        })
      );

      return NextResponse.json({
        message: `${updatedVideos.length} vídeo(s) atualizados`,
        updatedVideos: updatedVideos.length,
      });
    }

    if (action === "toggleBandType" && bandType) {
      // Ativar/desativar todos os vídeos de um tipo de banda
      const result = await prisma.video.updateMany({
        where: { bandType: bandType.toUpperCase() },
        data: { isActive: body.isActive },
      });

      return NextResponse.json({
        message: `${result.count} vídeo(s) do tipo ${bandType} atualizados`,
        count: result.count,
      });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (error) {
    console.error("Erro ao atualizar vídeos:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
