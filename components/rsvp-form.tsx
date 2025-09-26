"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Send,
  Heart,
  Users,
  Mail,
  Phone,
  MessageCircle,
  Calendar,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RSVPFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (name: string, guestCount: number) => void;
  eventName: string;
}

export function RSVPForm({
  isOpen,
  onClose,
  onSuccess,
  eventName,
}: RSVPFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests_count: 1,
    guest_names: [] as string[],
    message: "",
    will_attend: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addToDeviceCalendar = () => {
    const eventDate = new Date("2024-11-01T16:30:00");
    const endDate = new Date(eventDate.getTime() + 5.5 * 60 * 60 * 1000);

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

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
SUMMARY:Aniversário de Dedé Sales - 50 Anos
DESCRIPTION:Celebração dos 50 anos de Dedé Sales
LOCATION:Praia de Jacumã, Conde - PB
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "aniversario-dede-sales.ics";
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // Para Android e outros dispositivos
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        "Aniversário de Dedé Sales - 50 Anos"
      )}&dates=${formatDate(eventDate)}/${formatDate(
        endDate
      )}&details=${encodeURIComponent(
        "Celebração dos 50 anos de Dedé Sales"
      )}&location=${encodeURIComponent("Praia de Jacumã, Conde - PB")}`;
      window.open(calendarUrl, "_blank");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao confirmar presença");
      }

      // Chama o callback de sucesso se fornecido
      if (onSuccess) {
        onSuccess(formData.name, formData.guests_count);
      } else {
        toast({
          title: "Confirmação Recebida! 🎉",
          description:
            "Obrigado por confirmar sua presença. Mal podemos esperar para celebrar juntos!",
        });
        onClose();
      }

      // Limpa o formulário
      setFormData({
        name: "",
        email: "",
        phone: "",
        guests_count: 1,
        guest_names: [],
        message: "",
        will_attend: true,
      });
    } catch (error) {
      console.error("[v0] Erro ao enviar RSVP:", error);
      toast({
        title: "Erro ao confirmar presença",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "guests_count") {
      const count = Number.parseInt(value);
      setFormData((prev) => ({
        ...prev,
        guests_count: count,
        guest_names: count > 1 ? Array(count - 1).fill("") : [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleGuestNameChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      guest_names: prev.guest_names.map((name, i) =>
        i === index ? value : name
      ),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[60] flex items-center justify-center p-4 animate-fade-in-scale">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl animate-rotate-glow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-500/8 rounded-full blur-3xl animate-rotate-glow"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-effect border-2 border-yellow-400/40 shadow-2xl shadow-yellow-400/30 relative animate-bounce-in hover-lift">
        <CardHeader className="relative animate-slide-in-up">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/20 transition-all duration-300 hover:scale-110 animate-fade-in-scale"
          >
            <X className="h-5 w-5" />
          </Button>

          <div
            className="flex items-center gap-3 mb-4 animate-slide-in-left"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-full shadow-lg shadow-yellow-400/50 animate-heartbeat">
              <Heart className="h-6 w-6 text-black" />
            </div>
            <CardTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 font-poppins">
              Confirmar Presença
            </CardTitle>
            {/* Decorative elements */}
            <div className="flex gap-2 ml-auto">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>

          <Badge
            variant="secondary"
            className="w-fit bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-4 py-2 font-inter shadow-lg shadow-yellow-400/30 animate-bounce-in hover-lift"
            style={{ animationDelay: "0.4s" }}
          >
            {eventName}
          </Badge>
        </CardHeader>

        <CardContent className="relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              className="animate-slide-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              <Label
                htmlFor="name"
                className="text-yellow-400 font-semibold flex items-center gap-2 mb-2 animate-fade-in-scale"
              >
                <Users className="h-4 w-4 animate-pulse" />
                Nome Completo *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Seu nome completo"
                className="glass-effect border-yellow-400/40 focus:border-yellow-400 text-white placeholder:text-gray-400 transition-all duration-300 hover:border-yellow-400/60 focus:shadow-lg focus:shadow-yellow-400/20"
              />
            </div>

            <div
              className="grid md:grid-cols-2 gap-4 animate-slide-in-up"
              style={{ animationDelay: "0.8s" }}
            ></div>

            <div
              className="animate-fade-in-scale"
              style={{ animationDelay: "1.2s" }}
            >
              <Label
                htmlFor="guests_count"
                className="text-yellow-400 font-semibold flex items-center gap-2 mb-2"
              >
                <Users className="h-4 w-4 animate-bounce" />
                Número de Convidados
              </Label>
              <select
                id="guests_count"
                name="guests_count"
                value={formData.guests_count}
                onChange={handleChange}
                className="w-full px-4 py-3 glass-effect border border-yellow-400/40 rounded-md focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 text-white transition-all duration-300 hover:border-yellow-400/60 focus:shadow-lg focus:shadow-yellow-400/20"
              >
                <option value={1}>1 pessoa (só eu)</option>
                <option value={2}>2 pessoas</option>
                <option value={3}>3 pessoas</option>
                <option value={4}>4 pessoas</option>
                <option value={5}>5 pessoas</option>
                <option value={6}>6 pessoas</option>
              </select>
            </div>

            {formData.guests_count > 1 && (
              <div className="space-y-4">
                <Label className="text-yellow-400 font-semibold flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nomes dos Convidados Adicionais
                </Label>
                <div className="space-y-3">
                  {Array.from(
                    { length: formData.guests_count - 1 },
                    (_, index) => (
                      <div key={index}>
                        <Label
                          htmlFor={`guest-${index}`}
                          className="text-yellow-300 text-sm mb-1 block"
                        >
                          Convidado {index + 1}
                        </Label>
                        <Input
                          id={`guest-${index}`}
                          value={formData.guest_names[index] || ""}
                          onChange={(e) =>
                            handleGuestNameChange(index, e.target.value)
                          }
                          placeholder={`Nome do convidado ${index + 1}`}
                          className="bg-black/50 border-yellow-400/20 focus:border-yellow-400 text-white placeholder:text-gray-400 backdrop-blur-sm"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <div>
              <Label
                htmlFor="message"
                className="text-yellow-400 font-semibold flex items-center gap-2 mb-2"
              >
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

            <div
              className="flex flex-col sm:flex-row gap-3 animate-slide-in-up"
              style={{ animationDelay: "1.8s" }}
            >
              <Button
                type="button"
                onClick={addToDeviceCalendar}
                variant="outline"
                className="flex-1 border-2 border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-300 font-bold py-3 glass-effect transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30 animate-fade-in-scale"
              >
                <Calendar className="mr-2 h-5 w-5 animate-pulse" />
                Adicionar ao Calendário
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || !formData.name}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 text-lg shadow-lg shadow-yellow-400/40 transition-all duration-300 hover:shadow-yellow-400/60 hover:scale-105 disabled:opacity-50 animate-bounce-in animate-heartbeat"
                style={{ animationDelay: "0.2s" }}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Enviando confirmação...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Send className="h-5 w-5 animate-pulse" />
                    Confirmar Presença
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
