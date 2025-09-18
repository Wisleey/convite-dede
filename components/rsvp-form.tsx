"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Send, Heart, Users, Mail, Phone, MessageCircle, Calendar, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RSVPFormProps {
  isOpen: boolean
  onClose: () => void
  eventName: string
}

export function RSVPForm({ isOpen, onClose, eventName }: RSVPFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests_count: 1,
    guest_names: [] as string[],
    message: "",
    will_attend: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const addToDeviceCalendar = () => {
    const eventDate = new Date("2024-11-01T16:30:00")
    const endDate = new Date(eventDate.getTime() + 5.5 * 60 * 60 * 1000)

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    }

    // Para iOS Safari
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Birthday Invitation//EN
BEGIN:VEVENT
UID:${Date.now()}@birthday-invitation.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(eventDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Aniversário de Dedê Sales - 50 Anos
DESCRIPTION:Celebração dos 50 anos de Dedê Sales
LOCATION:Praia de Jacumã, Conde - PB
END:VEVENT
END:VCALENDAR`

      const blob = new Blob([icsContent], { type: "text/calendar" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "aniversario-dede-sales.ics"
      link.click()
      URL.revokeObjectURL(url)
    } else {
      // Para Android e outros dispositivos
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Aniversário de Dedê Sales - 50 Anos")}&dates=${formatDate(eventDate)}/${formatDate(endDate)}&details=${encodeURIComponent("Celebração dos 50 anos de Dedê Sales")}&location=${encodeURIComponent("Praia de Jacumã, Conde - PB")}`
      window.open(calendarUrl, "_blank")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao confirmar presença")
      }

      toast({
        title: "Confirmação Recebida! 🎉",
        description: "Obrigado por confirmar sua presença. Mal podemos esperar para celebrar juntos!",
      })

      onClose()
      setFormData({
        name: "",
        email: "",
        phone: "",
        guests_count: 1,
        guest_names: [],
        message: "",
        will_attend: true,
      })
    } catch (error) {
      console.error("[v0] Erro ao enviar RSVP:", error)
      toast({
        title: "Erro ao confirmar presença",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "guests_count") {
      const count = Number.parseInt(value)
      setFormData((prev) => ({
        ...prev,
        guests_count: count,
        guest_names: count > 1 ? Array(count - 1).fill("") : [],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleGuestNameChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      guest_names: prev.guest_names.map((name, i) => (i === index ? value : name)),
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 backdrop-blur-xl border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-600/5 rounded-lg" />

        <CardHeader className="relative">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-full">
              <Heart className="h-6 w-6 text-black" />
            </div>
            <CardTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 font-playfair">
              Confirmar Presença
            </CardTitle>
          </div>

          <Badge
            variant="secondary"
            className="w-fit bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-4 py-2 font-cormorant"
          >
            {eventName}
          </Badge>
        </CardHeader>

        <CardContent className="relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-yellow-400 font-semibold flex items-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                Nome Completo *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Seu nome completo"
                className="bg-black/50 border-yellow-400/30 focus:border-yellow-400 text-white placeholder:text-gray-400 backdrop-blur-sm"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-yellow-400 font-semibold flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4" />
                  E-mail
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="bg-black/50 border-yellow-400/30 focus:border-yellow-400 text-white placeholder:text-gray-400 backdrop-blur-sm"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-yellow-400 font-semibold flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4" />
                  Telefone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  className="bg-black/50 border-yellow-400/30 focus:border-yellow-400 text-white placeholder:text-gray-400 backdrop-blur-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="guests_count" className="text-yellow-400 font-semibold flex items-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                Número de Convidados
              </Label>
              <select
                id="guests_count"
                name="guests_count"
                value={formData.guests_count}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 border border-yellow-400/30 rounded-md focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 text-white backdrop-blur-sm"
              >
                <option value={1}>1 pessoa (só eu)</option>
                <option value={2}>2 pessoas</option>
                <option value={3}>3 pessoas</option>
                <option value={4}>4 pessoas</option>
                <option value={5}>5 pessoas</option>
                <option value={6}>6+ pessoas</option>
              </select>
            </div>

            {formData.guests_count > 1 && (
              <div className="space-y-4">
                <Label className="text-yellow-400 font-semibold flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nomes dos Convidados Adicionais
                </Label>
                <div className="space-y-3">
                  {Array.from({ length: formData.guests_count - 1 }, (_, index) => (
                    <div key={index}>
                      <Label htmlFor={`guest-${index}`} className="text-yellow-300 text-sm mb-1 block">
                        Convidado {index + 1}
                      </Label>
                      <Input
                        id={`guest-${index}`}
                        value={formData.guest_names[index] || ""}
                        onChange={(e) => handleGuestNameChange(index, e.target.value)}
                        placeholder={`Nome do convidado ${index + 1}`}
                        className="bg-black/50 border-yellow-400/20 focus:border-yellow-400 text-white placeholder:text-gray-400 backdrop-blur-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="message" className="text-yellow-400 font-semibold flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4" />
                Mensagem (Opcional)
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Deixe uma mensagem especial para o aniversariante..."
                className="bg-black/50 border-yellow-400/30 focus:border-yellow-400 text-white placeholder:text-gray-400 resize-none backdrop-blur-sm"
                rows={3}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                onClick={addToDeviceCalendar}
                variant="outline"
                className="flex-1 border-2 border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300 font-bold py-3 bg-transparent backdrop-blur-sm transition-all duration-300"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Adicionar ao Calendário
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || !formData.name}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 text-lg shadow-lg shadow-yellow-400/30 transition-all duration-300 hover:shadow-yellow-400/50 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Enviando confirmação...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Send className="h-5 w-5" />
                    Confirmar Presença
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
