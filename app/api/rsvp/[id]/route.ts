import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verifica se estamos em build time (sem DATABASE_URL)
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          error: "Banco de dados não disponível durante o build",
        },
        { status: 503 }
      );
    }

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Verifica se o RSVP existe
    const existingRSVP = await prisma.rsvp.findUnique({
      where: { id },
    });

    if (!existingRSVP) {
      return NextResponse.json(
        { error: "Confirmação não encontrada" },
        { status: 404 }
      );
    }

    // Remove o RSVP
    await prisma.rsvp.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Confirmação removida com sucesso",
    });
  } catch (error) {
    console.error("Erro ao remover RSVP:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
