// Script para configurar o backend Node.js/TypeScript para o sistema de RSVP
// Este script pode ser executado para configurar as APIs necessárias

interface RSVPData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  guests: number;
  message?: string;
  createdAt: Date;
  eventId: string;
}

interface EventData {
  id: string;
  name: string;
  date: Date;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Simulação de banco de dados em memória
const rsvpDatabase: RSVPData[] = [];
const eventDatabase: EventData[] = [
  {
    id: "dede-sales-50",
    name: "Aniversário de Dedé Sales - 50 Anos",
    date: new Date("2024-11-01T16:30:00"),
    location: "Praia de Jacumã",
    coordinates: {
      lat: -7.287466,
      lng: -34.802021,
    },
  },
];

// Função para salvar RSVP
export function saveRSVP(rsvpData: Omit<RSVPData, "id" | "createdAt">) {
  const newRSVP: RSVPData = {
    ...rsvpData,
    id: `rsvp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
  };

  rsvpDatabase.push(newRSVP);

  console.log(`[v0] RSVP salvo com sucesso:`, {
    id: newRSVP.id,
    name: newRSVP.name,
    guests: newRSVP.guests,
    eventId: newRSVP.eventId,
  });

  return newRSVP;
}

// Função para buscar RSVPs por evento
export function getRSVPsByEvent(eventId: string) {
  const rsvps = rsvpDatabase.filter((rsvp) => rsvp.eventId === eventId);

  console.log(
    `[v0] Encontrados ${rsvps.length} RSVPs para o evento ${eventId}`
  );

  return rsvps;
}

// Função para obter estatísticas do evento
export function getEventStats(eventId: string) {
  const rsvps = getRSVPsByEvent(eventId);
  const totalGuests = rsvps.reduce((sum, rsvp) => sum + rsvp.guests, 0);

  const stats = {
    totalRSVPs: rsvps.length,
    totalGuests,
    averageGuestsPerRSVP: rsvps.length > 0 ? totalGuests / rsvps.length : 0,
  };

  console.log(`[v0] Estatísticas do evento ${eventId}:`, stats);

  return stats;
}

// Simulação de uso do sistema
console.log(
  "[v0] Configurando sistema de backend para convite de aniversário..."
);

// Exemplo de RSVP
const exemploRSVP = {
  name: "João Silva",
  email: "joao@email.com",
  phone: "(83) 99999-9999",
  guests: 2,
  message: "Mal posso esperar para celebrar com vocês!",
  eventId: "dede-sales-50",
};

const rsvpSalvo = saveRSVP(exemploRSVP);
const estatisticas = getEventStats("dede-sales-50");

console.log("[v0] Sistema de backend configurado com sucesso!");
console.log("[v0] Exemplo de RSVP processado:", rsvpSalvo.id);
console.log("[v0] Estatísticas atuais:", estatisticas);
