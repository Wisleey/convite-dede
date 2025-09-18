export interface RSVPData {
  id: string
  name: string
  email: string
  phone: string
  guests: string
  message: string
  confirmedAt: string
}

export interface RSVPStats {
  totalConfirmations: number
  totalGuests: number
  lastUpdated: string
}

export const getRSVPData = (): RSVPData[] => {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem("birthday-rsvp-data")
  return data ? JSON.parse(data) : []
}

export const getRSVPStats = (): RSVPStats => {
  if (typeof window === "undefined") {
    return { totalConfirmations: 0, totalGuests: 0, lastUpdated: "" }
  }

  const stats = localStorage.getItem("birthday-rsvp-stats")
  return stats ? JSON.parse(stats) : { totalConfirmations: 0, totalGuests: 0, lastUpdated: "" }
}

export const deleteRSVP = (id: string): void => {
  if (typeof window === "undefined") return

  const data = getRSVPData()
  const filteredData = data.filter((rsvp) => rsvp.id !== id)

  localStorage.setItem("birthday-rsvp-data", JSON.stringify(filteredData))

  // Update stats
  const stats: RSVPStats = {
    totalConfirmations: filteredData.length,
    totalGuests: filteredData.reduce((sum, rsvp) => sum + Number.parseInt(rsvp.guests), 0),
    lastUpdated: new Date().toISOString(),
  }
  localStorage.setItem("birthday-rsvp-stats", JSON.stringify(stats))
}

export const exportRSVPData = (): string => {
  const data = getRSVPData()
  const csvHeader = "Nome,Email,Telefone,Convidados,Mensagem,Data de Confirmação\n"
  const csvData = data
    .map(
      (rsvp) =>
        `"${rsvp.name}","${rsvp.email}","${rsvp.phone}","${rsvp.guests}","${rsvp.message}","${new Date(rsvp.confirmedAt).toLocaleString("pt-BR")}"`,
    )
    .join("\n")

  return csvHeader + csvData
}
