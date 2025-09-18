"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  Clock,
  Gift,
  Heart,
  Navigation,
  Settings,
} from "lucide-react";
import { LocationMap } from "./location-map";
import { RSVPForm } from "./rsvp-form";
import { CountdownTimer } from "./countdown-timer";
import { AdminLogin } from "./admin-login";
import { AdminDashboard } from "./admin-dashboard";

export function BirthdayInvitation() {
  const [showRSVP, setShowRSVP] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const eventDetails = {
    name: "DEDÊ SALES",
    age: "50",
    date: "1 de Novembro",
    day: "Sábado",
    time: "16:30",
    location: "Praia de Jacumã",
    address: "Praia de Jacumã, Conde - PB",
    coordinates: {
      lat: -7.287466,
      lng: -34.802021,
    },
    eventDate: new Date("2024-11-01T16:30:00"),
  };

  useEffect(() => {
    const adminSession = localStorage.getItem("admin-session");
    if (adminSession) {
      const session = JSON.parse(adminSession);
      const now = new Date().getTime();
      // Session expires after 24 hours
      if (now - session.timestamp < 24 * 60 * 60 * 1000) {
        setIsAdminLoggedIn(true);
      } else {
        localStorage.removeItem("admin-session");
      }
    }
  }, []);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    // Save session for 24 hours
    localStorage.setItem(
      "admin-session",
      JSON.stringify({
        timestamp: new Date().getTime(),
      })
    );
    setShowAdminDashboard(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("admin-session");
    setShowAdminDashboard(false);
  };

  const handleAdminButtonClick = () => {
    if (isAdminLoggedIn) {
      setShowAdminDashboard(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const openInGPS = () => {
    const { lat, lng } = eventDetails.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const addToCalendar = () => {
    const startDate = eventDetails.eventDate;
    const endDate = new Date(startDate.getTime() + 5.5 * 60 * 60 * 1000); // 5.5 hours later

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    // Detectar se é iOS Safari para usar arquivo .ics
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Birthday Invitation//EN
BEGIN:VEVENT
UID:${Date.now()}@birthday-invitation.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Aniversário de ${eventDetails.name} - ${eventDetails.age} Anos
DESCRIPTION:Celebração dos ${eventDetails.age} anos de ${
        eventDetails.name
      }\\nPraia de Jacumã, Conde - PB
LOCATION:${eventDetails.address}
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Lembrete: Aniversário de ${eventDetails.name} em 1 hora
END:VALARM
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "aniversario-dede-sales.ics";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Para Android e outros dispositivos - usar Google Calendar
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        `Aniversário de ${eventDetails.name} - ${eventDetails.age} Anos`
      )}&dates=${formatDate(startDate)}/${formatDate(
        endDate
      )}&details=${encodeURIComponent(
        `Celebração dos ${eventDetails.age} anos de ${eventDetails.name}`
      )}&location=${encodeURIComponent(eventDetails.address)}`;
      window.open(calendarUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating golden particles */}
        <div className="absolute top-10 left-10 w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse opacity-80 shadow-lg shadow-yellow-400/50" />
        <div
          className="absolute top-32 right-20 w-4 h-4 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full animate-bounce opacity-60 shadow-lg shadow-yellow-300/50"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-16 w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-full animate-pulse opacity-70 shadow-lg shadow-yellow-500/50"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-32 w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-bounce opacity-90 shadow-lg shadow-yellow-400/50"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Golden light rays */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent transform rotate-12" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-yellow-300/15 to-transparent transform -rotate-12" />
      </div>

      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {isAdminLoggedIn && (
          <Button
            onClick={handleAdminLogout}
            variant="ghost"
            size="sm"
            className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 text-xs"
          >
            Sair
          </Button>
        )}
        <Button
          onClick={handleAdminButtonClick}
          variant="ghost"
          size="icon"
          className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 relative"
        >
          <Settings className="h-5 w-5" />
          {isAdminLoggedIn && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
          )}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16">
          {/* Conteúdo principal - lado esquerdo */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Golden ribbon effect */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 blur-lg opacity-30 rounded-lg" />
              <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 mb-4 tracking-wider animate-pulse drop-shadow-2xl font-poppins">
                {eventDetails.name}
              </h1>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-1 max-w-20 sm:max-w-40" />
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 blur-xl opacity-50 rounded-full" />
                <span className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-2xl font-poppins">
                  {eventDetails.age}
                </span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-1 max-w-20 sm:max-w-40" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-6 tracking-wide font-poppins">
              ANOS
            </h2>
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-yellow-400/20 blur-md rounded-lg" />
              <p className="relative text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-bold px-4 sm:px-8 py-4 border border-yellow-400/30 rounded-lg backdrop-blur-sm bg-black/30 font-inter">
                VOCÊ ESTÁ CONVIDADO(A) PARA COMEMORAR COMIGO!
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 blur-2xl opacity-40 rounded-full" />
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50">
                <img
                  src="/images/dede-photo.png"
                  alt="Dedê Sales"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-16">
          <CountdownTimer targetDate={eventDetails.eventDate} />
        </div>

        <Card className="max-w-6xl mx-auto mb-16 bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-xl border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-600/5" />
          <CardContent className="relative p-4 sm:p-8 md:p-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6 lg:space-y-8">
                <div className="text-center lg:text-left">
                  <Badge
                    variant="secondary"
                    className="mb-6 text-lg sm:text-xl px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold font-inter"
                  >
                    NOVEMBRO
                  </Badge>

                  <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-8 mb-6 lg:mb-8">
                    <div className="text-center">
                      <div className="text-xs sm:text-sm text-yellow-200 uppercase tracking-widest font-bold mb-2 bg-black/80 px-2 sm:px-3 py-1 rounded-md border border-yellow-400/30 font-inter">
                        {eventDetails.day}
                      </div>
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-full" />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-yellow-400/20 blur-lg rounded-full" />
                      <div className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 font-poppins">
                        1
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs sm:text-sm text-yellow-200 uppercase tracking-widest font-bold mb-2 bg-black/80 px-2 sm:px-3 py-1 rounded-md border border-yellow-400/30 font-inter">
                        ÀS {eventDetails.time}
                      </div>
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-full" />
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-6 lg:mb-8 tracking-wide font-poppins">
                    {eventDetails.location}
                  </h3>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={openInGPS}
                    className="flex-1 border-2 border-yellow-400 text-black hover:bg-yellow-400 hover:text-black font-bold py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg bg-yellow-400/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 hover:scale-105 font-inter"
                  >
                    <Navigation className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                    Ver no GPS
                  </Button>
                  <Button
                    onClick={() => setShowRSVP(true)}
                    variant="outline"
                    className="flex-1 border-2 border-yellow-400 text-black hover:bg-yellow-400 hover:text-black font-bold py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg bg-yellow-400/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 hover:scale-105 font-inter"
                  >
                    <Heart className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                    Confirmar Presença
                  </Button>
                </div>

                <Button
                  onClick={addToCalendar}
                  variant="outline"
                  className="flex-1 border-2 border-yellow-400 text-black hover:bg-yellow-400 hover:text-black font-bold py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg bg-yellow-400/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 hover:scale-105 font-inter"
                >
                  <Calendar className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                  Adicionar ao Calendário
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 blur-xl rounded-2xl" />
                <img
                  src="/images/birthday-invitation.png"
                  alt="Convite de Aniversário"
                  className="relative w-full h-auto rounded-2xl shadow-2xl border border-yellow-400/30"
                />
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 animate-bounce">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full p-3 sm:p-4 shadow-lg shadow-yellow-400/50">
                    <Gift className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="max-w-6xl mx-auto text-center">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            <Card className="bg-gradient-to-br from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl border-2 border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-400/10">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 sm:p-4 rounded-full w-fit mx-auto mb-4">
                  <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-black" />
                </div>
                <h4 className="font-bold text-lg sm:text-xl mb-3 text-yellow-400 font-poppins">
                  Data
                </h4>
                <p className="text-white text-base sm:text-lg font-inter">
                  {eventDetails.day}, {eventDetails.date}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl border-2 border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-400/10">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 sm:p-4 rounded-full w-fit mx-auto mb-4">
                  <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-black" />
                </div>
                <h4 className="font-bold text-lg sm:text-xl mb-3 text-yellow-400 font-poppins">
                  Horário
                </h4>
                <p className="text-white text-base sm:text-lg font-inter">
                  {eventDetails.time}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl border-2 border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-400/10 sm:col-span-2 md:col-span-1">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 sm:p-4 rounded-full w-fit mx-auto mb-4">
                  <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-black" />
                </div>
                <h4 className="font-bold text-lg sm:text-xl mb-3 text-yellow-400 font-poppins">
                  Local
                </h4>
                <p className="text-white text-base sm:text-lg font-inter">
                  {eventDetails.location}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showRSVP && (
        <RSVPForm
          isOpen={showRSVP}
          onClose={() => setShowRSVP(false)}
          eventName={`Aniversário de ${eventDetails.name}`}
        />
      )}

      {showAdminLogin && (
        <AdminLogin
          isOpen={showAdminLogin}
          onClose={() => setShowAdminLogin(false)}
          onLogin={handleAdminLogin}
        />
      )}

      {showAdminDashboard && (
        <AdminDashboard
          isOpen={showAdminDashboard}
          onClose={() => setShowAdminDashboard(false)}
        />
      )}
    </div>
  );
}
