"use client";

import { useState, useEffect, useRef } from "react";
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
  Play,
  Pause,
  Music,
  Star,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { LocationMap } from "./location-map";
import { RSVPForm } from "./rsvp-form";
import { CountdownTimer } from "./countdown-timer";
import { AdminLogin } from "./admin-login";
import { AdminDashboard } from "./admin-dashboard";
import { ThankYouModal } from "./thank-you-modal";

interface VideoData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  bandType: "principal" | "especial";
  isActive: boolean;
}

export function BirthdayInvitation() {
  const [showRSVP, setShowRSVP] = useState(false);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const [isVideo1Playing, setIsVideo1Playing] = useState(false);
  const [isVideo2Playing, setIsVideo2Playing] = useState(false);
  const [isVideo1Muted, setIsVideo1Muted] = useState(true);
  const [isVideo2Muted, setIsVideo2Muted] = useState(true);
  const [showFullscreenVideo, setShowFullscreenVideo] = useState(false);
  const [fullscreenVideoSrc, setFullscreenVideoSrc] = useState("");
  const [videosData, setVideosData] = useState<VideoData[]>([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [lastRSVPData, setLastRSVPData] = useState<{
    name: string;
    guestCount: number;
  } | null>(null);

  const eventDetails = {
    name: "DEDÉ SALES",
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
    eventDate: new Date("2025-11-01T16:30:00"),
  };

  // Função para buscar vídeos do banco de dados
  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      if (response.ok) {
        const videos = await response.json();
        setVideosData(videos);
      }
    } catch (error) {
      console.error("Erro ao buscar vídeos:", error);
      // Fallback para vídeos padrão se a API falhar
      setVideosData([
        {
          id: "1",
          title: "BANDA PRINCIPAL",
          description: "Os maiores sucessos para embalar nossa celebração",
          videoUrl: "/videos/dede.mp4",
          thumbnailUrl: "/images/banda1-thumbnail.jpg",
          bandType: "principal",
          isActive: true,
        },
      ]);
    }
  };

  useEffect(() => {
    fetchVideos();

    const adminSession = localStorage.getItem("admin-session");
    if (adminSession) {
      const session = JSON.parse(adminSession);
      const now = new Date().getTime();
      if (now - session.timestamp < 24 * 60 * 60 * 1000) {
        setIsAdminLoggedIn(true);
      } else {
        localStorage.removeItem("admin-session");
      }
    }
  }, []);

  // Função para abrir vídeo em tela cheia com som
  const openFullscreenVideo = (videoSrc: string) => {
    setFullscreenVideoSrc(videoSrc);
    setShowFullscreenVideo(true);

    // Pausar todos os outros vídeos
    if (video1Ref.current) {
      video1Ref.current.pause();
      setIsVideo1Playing(false);
    }
    if (video2Ref.current) {
      video2Ref.current.pause();
      setIsVideo2Playing(false);
    }
  };

  // Função para fechar vídeo em tela cheia
  const closeFullscreenVideo = () => {
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.pause();
    }
    setShowFullscreenVideo(false);
    setFullscreenVideoSrc("");
  };

  // Controles do vídeo 1
  const handleVideo1PlayPause = () => {
    const video = video1Ref.current;
    if (video) {
      if (video.paused) {
        const videoSrc = principalVideo?.videoUrl || "/videos/dede.mp4";
        openFullscreenVideo(videoSrc);
      } else {
        video.pause();
        setIsVideo1Playing(false);
      }
    }
  };

  // Controles do vídeo 2
  const handleVideo2PlayPause = () => {
    const video = video2Ref.current;
    if (video) {
      if (video.paused) {
        const videoSrc = especialVideo?.videoUrl || "/videos/banda2.mp4";
        openFullscreenVideo(videoSrc);
      } else {
        video.pause();
        setIsVideo2Playing(false);
      }
    }
  };

  // Auto-play do vídeo em tela cheia
  useEffect(() => {
    if (showFullscreenVideo && fullscreenVideoRef.current) {
      const video = fullscreenVideoRef.current;
      video.muted = false; // Garantir que o som esteja ativo
      video.play().catch((error) => {
        console.log("Erro ao reproduzir vídeo:", error);
        // Se falhar por política do navegador, tenta com mute primeiro
        video.muted = true;
        video.play().then(() => {
          // Depois de um pequeno delay, tenta desmutar
          setTimeout(() => {
            video.muted = false;
          }, 1000);
        });
      });
    }
  }, [showFullscreenVideo, fullscreenVideoSrc]);

  // Controle de áudio
  const toggleVideo1Mute = () => {
    const video = video1Ref.current;
    if (video) {
      video.muted = !video.muted;
      setIsVideo1Muted(video.muted);
    }
  };

  const toggleVideo2Mute = () => {
    const video = video2Ref.current;
    if (video) {
      video.muted = !video.muted;
      setIsVideo2Muted(video.muted);
    }
  };

  // Event listeners para atualizar estado quando vídeo termina
  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    const handleVideo1End = () => setIsVideo1Playing(false);
    const handleVideo2End = () => setIsVideo2Playing(false);

    if (video1) {
      video1.addEventListener("ended", handleVideo1End);
    }
    if (video2) {
      video2.addEventListener("ended", handleVideo2End);
    }

    return () => {
      if (video1) video1.removeEventListener("ended", handleVideo1End);
      if (video2) video2.removeEventListener("ended", handleVideo2End);
    };
  }, []);

  // Fechar vídeo fullscreen com ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showFullscreenVideo) {
        closeFullscreenVideo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showFullscreenVideo]);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
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

  const handleRSVPSuccess = (name: string, guestCount: number) => {
    setLastRSVPData({ name, guestCount });
    setShowRSVP(false);
    setShowThankYou(true);
  };

  const openInGPS = () => {
    const { lat, lng } = eventDetails.coordinates;
    const address = encodeURIComponent(eventDetails.address);

    // Detectar dispositivo móvel
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // Para dispositivos móveis, tentar abrir app nativo primeiro
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // iOS - tenta Apple Maps primeiro, depois Google Maps
        const appleUrl = `maps://maps.apple.com/?daddr=${lat},${lng}`;
        const googleUrl = `comgooglemaps://?daddr=${lat},${lng}`;
        const fallbackUrl = `https://maps.google.com/maps?daddr=${lat},${lng}`;

        // Tenta abrir Apple Maps
        window.location.href = appleUrl;

        // Fallback para Google Maps se Apple Maps não estiver disponível
        setTimeout(() => {
          window.location.href = googleUrl;
        }, 500);

        // Fallback final para web
        setTimeout(() => {
          window.open(fallbackUrl, "_blank");
        }, 1000);
      } else {
        // Android - tenta Google Maps app primeiro
        const googleAppUrl = `google.navigation:q=${lat},${lng}`;
        const fallbackUrl = `https://maps.google.com/maps?daddr=${lat},${lng}`;

        window.location.href = googleAppUrl;

        // Fallback para web se app não estiver disponível
        setTimeout(() => {
          window.open(fallbackUrl, "_blank");
        }, 1000);
      }
    } else {
      // Desktop - abre Google Maps web com direções
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
      window.open(url, "_blank");
    }
  };

  const addToCalendar = () => {
    const startDate = eventDetails.eventDate;
    const endDate = new Date(startDate.getTime() + 5.5 * 60 * 60 * 1000);

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

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

  // Buscar vídeos ativos do banco
  const principalVideo = videosData.find(
    (v) => v.bandType === "principal" && v.isActive
  );
  const especialVideo = videosData.find(
    (v) => v.bandType === "especial" && v.isActive
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-yellow-900/5 to-black animate-pulse" />
          <div className="absolute top-10 left-10 w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-gold-pulse opacity-30" />
          <div
            className="absolute top-32 right-20 w-4 h-4 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full animate-bounce opacity-20"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-40 left-16 w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-full animate-sparkle opacity-25"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-20 right-32 w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-heartbeat opacity-30"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute top-1/2 left-8 w-5 h-5 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full animate-float opacity-25"
            style={{ animationDelay: "3s" }}
          />
          <div
            className="absolute top-3/4 right-16 w-7 h-7 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full animate-bounce opacity-30"
            style={{ animationDelay: "1.5s" }}
          />
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-yellow-400/30 to-transparent transform rotate-12 animate-pulse" />
          <div
            className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-yellow-300/20 to-transparent transform -rotate-12 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-yellow-500/15 to-transparent transform rotate-6 animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl animate-rotate-glow" />
          <div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-yellow-500/8 rounded-full blur-3xl animate-rotate-glow"
            style={{ animationDelay: "4s" }}
          />
        </div>

        {/* Admin Controls */}
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

        <div className="container mx-auto px-4 py-8 relative z-20">
          {/* Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-8 lg:mb-16">
            <div className="text-center lg:text-left order-2 lg:order-1 animate-slide-in-left">
              <div className="relative inline-block mb-8 animate-bounce-in">
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-yellow-400 mb-4 tracking-wider font-poppins">
                  {eventDetails.name}
                </h1>
                <Star className="absolute -top-4 -left-4 w-6 h-6 text-yellow-400 animate-sparkle drop-shadow-lg" />
                <Sparkles
                  className="absolute -top-2 -right-6 w-8 h-8 text-yellow-300 animate-bounce"
                  style={{ animationDelay: "1s" }}
                />
                <Star
                  className="absolute -bottom-2 left-1/2 w-5 h-5 text-yellow-500 animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>

              <div
                className="flex items-center justify-start gap-6 mb-8 animate-fade-in-scale"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-1 max-w-20 sm:max-w-40 animate-pulse" />
                <div className="relative animate-heartbeat">
                  <span className="text-6xl md:text-8xl lg:text-[10rem] font-black text-yellow-400 font-poppins">
                    {eventDetails.age}
                  </span>
                  <div className="absolute -top-8 -right-8 animate-bounce">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full p-2 shadow-lg">
                      <Gift className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <div
                  className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-1 max-w-20 sm:max-w-40 animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>

              <h2
                className="text-3xl md:text-5xl lg:text-6xl font-black text-yellow-400 mb-6 tracking-wide font-poppins animate-slide-in-up"
                style={{ animationDelay: "0.6s" }}
              >
                ANOS
              </h2>
              <div
                className="relative inline-block animate-fade-in-scale hover-lift"
                style={{ animationDelay: "0.9s" }}
              >
                <p className="text-lg md:text-2xl lg:text-3xl text-white font-bold px-4 md:px-6 lg:px-8 py-4 border border-yellow-400/40 rounded-lg bg-black/50 font-inter">
                  VOCÊ ESTÁ CONVIDADO(A) PARA COMEMORAR COMIGO!
                </p>
                <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-yellow-400 animate-sparkle" />
                <Heart className="absolute -bottom-3 -left-3 w-6 h-6 text-yellow-500 animate-heartbeat" />
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-slide-in-right">
              <div className="relative inline-block hover-lift">
                <div className="relative w-48 md:w-64 lg:w-80 h-48 md:h-64 lg:h-80 rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl shadow-yellow-400/60 animate-bounce-in">
                  <img
                    src="/images/dede-photo.png"
                    alt="Dedé Sales"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-yellow-400/20 via-transparent to-transparent" />
                </div>
                <Music
                  className="absolute -top-6 -right-6 w-8 h-8 text-yellow-400 animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                />
                <Heart
                  className="absolute top-1/4 -left-8 w-6 h-6 text-yellow-500 animate-heartbeat"
                  style={{ animationDelay: "1s" }}
                />
                <Star
                  className="absolute bottom-1/4 -right-8 w-7 h-7 text-yellow-300 animate-sparkle"
                  style={{ animationDelay: "1.5s" }}
                />
                <Gift
                  className="absolute -bottom-4 -left-4 w-6 h-6 text-yellow-600 animate-bounce"
                  style={{ animationDelay: "2s" }}
                />
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div
            className="max-w-6xl mx-auto mb-16 animate-fade-in-scale"
            style={{ animationDelay: "1.2s" }}
          >
            <CountdownTimer targetDate={eventDetails.eventDate} />
          </div>

          {/* Video Section */}
          <div
            className="max-w-6xl mx-auto mb-16 animate-slide-in-up"
            style={{ animationDelay: "1.5s" }}
          >
            <Card className="glass-effect border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20 overflow-hidden hover-lift">
              <CardContent className="relative p-4 sm:p-8 md:p-12">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-1 max-w-32" />
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-full animate-bounce">
                      <Music className="h-8 w-8 text-black" />
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-1 max-w-32" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-yellow-400 mb-4 font-poppins">
                    ATRAÇÕES MUSICAIS
                  </h3>
                  <p className="text-lg sm:text-xl text-yellow-200 font-inter">
                    Prepare-se para uma festa inesquecível com as melhores
                    bandas!
                  </p>
                </div>

                {/* Video Grid */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-8">
                  {/* Video 1 - Principal */}
                  <div
                    className="relative group animate-fade-in-scale"
                    style={{ animationDelay: "1.8s" }}
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-yellow-400/40 video-glow hover:border-yellow-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/40">
                      <video
                        ref={video1Ref}
                        className="w-full h-full object-cover"
                        poster={
                          principalVideo?.thumbnailUrl ||
                          "/images/banda1-thumbnail.jpg"
                        }
                        preload="metadata"
                        muted={true}
                        controls={false}
                        playsInline
                      >
                        <source
                          src={principalVideo?.videoUrl || "/videos/dede.mp4"}
                          type="video/mp4"
                        />
                        Seu navegador não suporta o elemento de vídeo.
                      </video>

                      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-yellow-900/30 z-10 pointer-events-none" />

                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <button
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full p-4 sm:p-6 shadow-2xl shadow-yellow-400/50 hover:scale-110 transition-all duration-300 animate-heartbeat group-hover:shadow-yellow-400/70 hover:from-yellow-300 hover:to-yellow-500"
                          onClick={handleVideo1PlayPause}
                          aria-label="Assistir vídeo em tela cheia"
                        >
                          <Play className="h-8 w-8 sm:h-12 sm:w-12 ml-1" />
                        </button>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 sm:p-6 z-20 pointer-events-none">
                        <h4 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-2 font-poppins">
                          🎸 {principalVideo?.title || "BANDA PRINCIPAL"}
                        </h4>
                        <p className="text-white/90 text-sm sm:text-base font-inter">
                          {principalVideo?.description ||
                            "Os maiores sucessos para embalar nossa celebração"}
                        </p>
                      </div>

                      <Sparkles className="absolute top-4 left-4 w-5 h-5 text-yellow-400 animate-sparkle z-20 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Call to Act */}
                <div
                  className="text-center animate-bounce-in"
                  style={{ animationDelay: "2.4s" }}
                >
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/40 rounded-full px-6 py-3 glass-effect">
                    <Music className="h-5 w-5 text-yellow-400 animate-bounce" />
                    <span className="text-yellow-200 font-semibold font-inter">
                      Prepare-se para dançar a noite toda!
                    </span>
                    <Sparkles className="h-5 w-5 text-yellow-400 animate-sparkle" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Details Section */}
          <Card
            className="max-w-6xl mx-auto mb-16 glass-effect border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20 overflow-hidden hover-lift animate-slide-in-up"
            style={{ animationDelay: "2.7s" }}
          >
            <CardContent className="relative p-4 sm:p-8 md:p-16">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div
                  className="space-y-6 lg:space-y-8 animate-slide-in-left"
                  style={{ animationDelay: "3s" }}
                >
                  <div className="text-center lg:text-left">
                    <Badge
                      variant="secondary"
                      className="mb-6 text-lg sm:text-xl px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold font-inter animate-bounce-in hover-lift"
                    >
                      NOVEMBRO
                    </Badge>

                    <div
                      className="flex items-center justify-center lg:justify-start gap-4 sm:gap-8 mb-6 lg:mb-8 animate-fade-in-scale"
                      style={{ animationDelay: "3.3s" }}
                    >
                      <div
                        className="text-center animate-slide-in-left"
                        style={{ animationDelay: "3.6s" }}
                      >
                        <div className="text-xs sm:text-sm text-yellow-200 uppercase tracking-widest font-bold mb-2 glass-effect px-2 sm:px-3 py-1 rounded-md border border-yellow-400/40 font-inter hover-lift">
                          {eventDetails.day}
                        </div>
                        <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-full animate-pulse" />
                      </div>
                      <div className="relative animate-heartbeat">
                        <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-yellow-400 font-poppins">
                          1
                        </div>
                        <Star className="absolute -top-4 -right-4 w-6 h-6 text-yellow-400 animate-sparkle" />
                      </div>
                      <div
                        className="text-center animate-slide-in-right"
                        style={{ animationDelay: "3.6s" }}
                      >
                        <div className="text-xs sm:text-sm text-yellow-200 uppercase tracking-widest font-bold mb-2 glass-effect px-2 sm:px-3 py-1 rounded-md border border-yellow-400/40 font-inter hover-lift">
                          ÀS {eventDetails.time}
                        </div>
                        <div
                          className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-full animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        />
                      </div>
                    </div>

                    <h3
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-yellow-400 mb-6 lg:mb-8 tracking-wide font-poppins animate-fade-in-scale"
                      style={{ animationDelay: "3.9s" }}
                    >
                      {eventDetails.location}
                    </h3>
                  </div>

                  <div
                    className="flex flex-col md:flex-row gap-4 animate-slide-in-up"
                    style={{ animationDelay: "4.2s" }}
                  >
                    <Button
                      onClick={openInGPS}
                      className="flex-1 border-2 border-yellow-400 text-black hover:bg-yellow-300 hover:text-black font-bold py-4 px-8 text-lg bg-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 hover:scale-105 font-inter hover-lift animate-bounce-in"
                    >
                      <Navigation className="mr-3 h-6 w-6 animate-pulse" />
                      Ver no GPS
                    </Button>
                    <Button
                      onClick={() => setShowRSVP(true)}
                      className="flex-1 border-2 border-yellow-400 text-black hover:bg-yellow-300 hover:text-black font-bold py-4 px-8 text-lg bg-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 hover:scale-105 font-inter hover-lift animate-bounce-in animate-heartbeat"
                      style={{ animationDelay: "0.2s" }}
                    >
                      <Heart className="mr-3 h-6 w-6 animate-heartbeat" />
                      Confirmar Presença
                    </Button>
                  </div>

                  <Button
                    onClick={addToCalendar}
                    className="w-full border-2 border-yellow-400 text-black hover:bg-yellow-300 hover:text-black font-bold py-4 px-8 text-lg bg-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 hover:scale-105 font-inter hover-lift animate-fade-in-scale"
                    style={{ animationDelay: "4.5s" }}
                  >
                    <Calendar className="mr-3 h-6 w-6 animate-pulse" />
                    Adicionar ao Calendário
                  </Button>
                </div>

                <div
                  className="relative animate-slide-in-right hover-lift"
                  style={{ animationDelay: "4.8s" }}
                >
                  <img
                    src="/images/birthday-invitation.png"
                    alt="Convite de Aniversário"
                    className="relative w-full h-auto rounded-2xl shadow-2xl border-2 border-yellow-400/40 transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 animate-bounce">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full p-3 sm:p-4 shadow-lg shadow-yellow-400/50 animate-heartbeat">
                      <Gift className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                  </div>
                  <Sparkles className="absolute -top-2 -left-2 w-6 h-6 text-yellow-400 animate-sparkle" />
                  <Star
                    className="absolute -bottom-2 -right-2 w-5 h-5 text-yellow-500 animate-pulse"
                    style={{ animationDelay: "1s" }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        {showRSVP && (
          <RSVPForm
            isOpen={showRSVP}
            onClose={() => setShowRSVP(false)}
            onSuccess={handleRSVPSuccess}
            eventName={`Aniversário de ${eventDetails.name}`}
          />
        )}

        {showThankYou && lastRSVPData && (
          <ThankYouModal
            isOpen={showThankYou}
            onClose={() => setShowThankYou(false)}
            guestName={lastRSVPData.name}
            guestCount={lastRSVPData.guestCount}
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

      {/* Fullscreen Video Modal */}
      {showFullscreenVideo && (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeFullscreenVideo}
            className="absolute top-4 right-4 z-[101] bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
            aria-label="Fechar vídeo"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Fullscreen Video */}
          <video
            ref={fullscreenVideoRef}
            className="w-full h-full object-cover"
            controls={false}
            playsInline
            onEnded={closeFullscreenVideo}
          >
            <source src={fullscreenVideoSrc} type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </div>
      )}
    </>
  );
}
