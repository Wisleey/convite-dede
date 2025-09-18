// app/api/rsvp/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { neon, neonConfig } from "@neondatabase/serverless";

// Cache de conexão para Next.js / serverless
neonConfig.fetchConnectionCache = true;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL não definida. Coloque no .env a URL do Neon com sslmode=require."
  );
}

const sql = neon(DATABASE_URL);

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
    const guests_count = Math.max(1, Math.min(99, guests)); // 1..99
    const message = body.message?.trim() || null;
    const will_attend = body.will_attend === false ? false : true;
    const guest_names = Array.isArray(body.guest_names) ? body.guest_names : [];

    // Obs: se a coluna guest_names for JSON/JSONB, fazemos CAST explícito (::jsonb)
    const result = await sql/* sql */ `
      INSERT INTO rsvps (
        name,
        email,
        phone,
        guests_count,
        guest_names,
        message,
        will_attend,
        created_at,
        updated_at
      )
      VALUES (
        ${name},
        ${email},
        ${phone},
        ${guests_count},
        ${JSON.stringify(guest_names)}::jsonb,
        ${message},
        ${will_attend},
        NOW(),
        NOW()
      )
      RETURNING
        id,
        name,
        email,
        phone,
        guests_count,
        guest_names,
        message,
        will_attend,
        created_at,
        updated_at
    `;

    const rsvpData = result[0];

    console.log("[RSVP] Salvo no Neon:", rsvpData);

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
    // Optional: busca por nome/email/telefone via ?q=
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").trim();

    const where =
      q.length > 0
        ? sql`WHERE will_attend = true AND (name ILIKE ${
            "%" + q + "%"
          } OR email ILIKE ${"%" + q + "%"} OR phone ILIKE ${"%" + q + "%"})`
        : sql`WHERE will_attend = true`;

    const rsvps = await sql/* sql */ `
      SELECT
        id,
        name,
        email,
        phone,
        guests_count,
        guest_names,
        message,
        will_attend,
        created_at
      FROM rsvps
      ${where}
      ORDER BY created_at DESC
    `;

    const stats = await sql/* sql */ `
      SELECT
        COUNT(*)::int                                AS total_confirmations,
        COALESCE(SUM(guests_count), 0)::int          AS total_guests
      FROM rsvps
      ${where}
    `;

    return NextResponse.json({
      success: true,
      data: rsvps,
      stats: {
        totalRSVPs: Number(stats[0].total_confirmations),
        totalGuests: Number(stats[0].total_guests),
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
