"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Star,
  Sparkles,
  Gift,
  Music,
  MapPin,
  Calendar,
  PartyPopper,
  X,
} from "lucide-react";

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestName: string;
  guestCount: number;
}

export function ThankYouModal({
  isOpen,
  onClose,
  guestName,
  guestCount,
}: ThankYouModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Remove confetti após 3 segundos
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[70] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 animate-fade-in-scale overflow-y-auto">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-yellow-400/10 rounded-full blur-3xl animate-rotate-glow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-yellow-500/8 rounded-full blur-3xl animate-rotate-glow"
          style={{ animationDelay: "4s" }}
        />

        {/* Confetti Effect - Responsivo */}
        {showConfetti && (
          <>
            {[...Array(window.innerWidth < 768 ? 12 : 20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Modal Container - Totalmente responsivo */}
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto my-4 sm:my-8">
        <Card className="glass-effect border-2 border-yellow-400/50 shadow-2xl shadow-yellow-400/40 relative animate-bounce-in overflow-hidden">
          {/* Close button - Responsivo */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 sm:right-4 sm:top-4 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/20 transition-all duration-300 hover:scale-110 z-10 h-8 w-8 sm:h-10 sm:w-10"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <CardContent className="relative p-4 sm:p-6 md:p-8 lg:p-12 text-center">
            {/* Main celebration icon - Responsivo */}
            <div className="mb-4 sm:mb-6 md:mb-8 animate-bounce-in">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 sm:p-4 md:p-6 rounded-full w-fit mx-auto shadow-2xl shadow-yellow-400/50 animate-heartbeat">
                <PartyPopper className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-black" />
              </div>
            </div>

            {/* Thank you message - Responsivo */}
            <div
              className="space-y-3 sm:space-y-4 md:space-y-6 animate-slide-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-yellow-400 mb-2 sm:mb-4 font-poppins leading-tight">
                🎉 CONFIRMAÇÃO RECEBIDA! 🎉
              </h2>

              <div className="bg-black/50 border border-yellow-400/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8">
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4 font-inter">
                  Olá,{" "}
                  <span className="text-yellow-400 break-words">
                    {guestName}
                  </span>
                  !
                </h3>

                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed mb-3 sm:mb-4 md:mb-6 font-inter">
                  <strong className="text-yellow-400">
                    Que alegria imensa
                  </strong>{" "}
                  saber que você estará presente na minha celebração de 50 anos!
                  {guestCount > 1 && (
                    <span>
                      {" "}
                      Junto com seus{" "}
                      <strong className="text-yellow-400">
                        {guestCount - 1}
                      </strong>{" "}
                      convidados,{" "}
                    </span>
                  )}
                  <strong className="text-yellow-400">
                    Você fará parte de um momento único e especial
                  </strong>{" "}
                  na minha vida.
                </p>

                <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/40 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-6">
                  <p className="text-yellow-200 font-semibold text-xs sm:text-sm md:text-base lg:text-lg font-inter">
                    ✨ Prepare-se para uma festa inesquecível na Praia de
                    Jacumã! ✨
                  </p>
                </div>
              </div>
            </div>

            {/* Event details reminder - Grid responsivo */}
            <div
              className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6 md:mt-8 animate-fade-in-scale"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="bg-black/40 border border-yellow-400/30 rounded-lg sm:rounded-xl p-3 sm:p-4 hover-lift">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 flex-shrink-0" />
                  <span className="font-semibold text-yellow-400 text-sm sm:text-base">
                    Data
                  </span>
                </div>
                <p className="text-white text-sm sm:text-base">
                  Sábado, 1 de Novembro
                </p>
                <p className="text-white text-sm sm:text-base">às 16:30</p>
              </div>

              <div className="bg-black/40 border border-yellow-400/30 rounded-lg sm:rounded-xl p-3 sm:p-4 hover-lift">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 flex-shrink-0" />
                  <span className="font-semibold text-yellow-400 text-sm sm:text-base">
                    Local
                  </span>
                </div>
                <p className="text-white text-sm sm:text-base">
                  Praia de Jacumã
                </p>
                <p className="text-white/80 text-xs sm:text-sm">Conde - PB</p>
              </div>
            </div>

            {/* Call to action - Responsivo */}
            <div
              className="mt-4 sm:mt-6 md:mt-8 space-y-3 sm:space-y-4 animate-slide-in-up"
              style={{ animationDelay: "0.9s" }}
            >
              <div className="flex items-center justify-center gap-2 text-yellow-200 flex-wrap">
                <Music className="h-4 w-4 sm:h-5 sm:w-5 animate-bounce flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-sm md:text-base text-center">
                  Prepare-se para dançar, cantar e celebrar!
                </span>
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 animate-heartbeat flex-shrink-0" />
              </div>

              <Button
                onClick={onClose}
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-2 px-4 sm:py-3 sm:px-6 md:px-8 text-sm sm:text-base md:text-lg shadow-lg shadow-yellow-400/40 transition-all duration-300 hover:shadow-yellow-400/60 hover:scale-105 animate-heartbeat min-h-[44px]"
              >
                <Gift className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-center">
                  Estou Ansioso(a) para a Festa!
                </span>
              </Button>
            </div>

            {/* Decorative elements - Responsivos e condicionais */}
            <div className="hidden sm:block absolute top-4 sm:top-8 left-4 sm:left-8">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 animate-sparkle" />
            </div>
            <div className="hidden sm:block absolute top-6 sm:top-12 right-6 sm:right-12">
              <Star className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-500 animate-pulse" />
            </div>
            <div className="hidden sm:block absolute bottom-4 sm:bottom-8 left-6 sm:left-12">
              <Heart className="h-5 w-5 sm:h-7 sm:w-7 text-yellow-400 animate-heartbeat" />
            </div>
            <div className="hidden sm:block absolute bottom-6 sm:bottom-12 right-4 sm:right-8">
              <Gift className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-500 animate-bounce" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
