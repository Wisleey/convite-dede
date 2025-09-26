// app/api/rsvp/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RSVPRequest {
  name: string;
  email?: string;
  phone?: string;
  guests_count?: number;
  guest_names?: string[];
  message?: string;
  will_attend?: boolean; // default = true
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

    const body: RSVPRequest = await request.json();

    // --- Validação básica ---
    const name = (body.name ?? "").trim();
    if (!name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    const email = body.email?.trim() || null;
    const phone = body.phone?.trim() || null;
    const guests = Number.isFinite(body.guests_count as number)
      ? Number(body.guests_count)
      : 1;
    const guestsCount = Math.max(1, Math.min(99, guests)); // 1..99
    const message = body.message?.trim() || null;
    const willAttend = body.will_attend === false ? false : true;
    const guestNames = Array.isArray(body.guest_names) ? body.guest_names : [];

    // Usando Prisma para consistência
    const rsvpData = await prisma.rsvp.create({
      data: {
        name,
        email,
        phone,
        guestsCount,
        guestNames,
        message,
        willAttend,
      },
    });

    console.log("[RSVP] Salvo com Prisma:", rsvpData);

    return NextResponse.json({
      success: true,
      message: "RSVP confirmado com sucesso!",
      data: rsvpData,
    });
  } catch (error) {
    console.error("[RSVP] Erro ao processar:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verifica se estamos em build time (sem DATABASE_URL)
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        data: [],
        stats: { totalRSVPs: 0, totalGuests: 0 },
      });
    }

    // Optional: busca por nome/email/telefone via ?q=
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").trim();

    const whereCondition =
      q.length > 0
        ? {
            willAttend: true,
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
              { phone: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : { willAttend: true };

    const rsvps = await prisma.rsvp.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        guestsCount: true,
        guestNames: true,
        message: true,
        willAttend: true,
        createdAt: true,
      },
    });

    const stats = await prisma.rsvp.aggregate({
      where: whereCondition,
      _count: { id: true },
      _sum: { guestsCount: true },
    });

    return NextResponse.json({
      success: true,
      data: rsvps,
      stats: {
        totalRSVPs: stats._count.id || 0,
        totalGuests: stats._sum.guestsCount || 0,
      },
    });
  } catch (error) {
    console.error("[RSVP] Erro ao buscar:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
