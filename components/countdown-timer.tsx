"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate?: Date; // Torna opcional pois vamos buscar do banco
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface EventSettings {
  id: number;
  eventName: string;
  eventDate: string;
  location: string;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEventPassed, setIsEventPassed] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Busca a data do evento do banco de dados com cache
    const fetchEventDate = async () => {
      try {
        // Primeiro tenta buscar do cache local
        const cachedEventDate = localStorage.getItem("eventDate");
        if (cachedEventDate) {
          const cachedDate = new Date(cachedEventDate);
          // Verifica se a data cached não é de 2024 (data antiga)
          if (cachedDate.getFullYear() >= 2025) {
            setEventDate(cachedDate);
            setIsLoading(false);
          } else {
            // Remove cache antigo
            localStorage.removeItem("eventDate");
          }
        }

        // Sempre busca do servidor para manter atualizado
        const response = await fetch("/api/event-settings");
        const result = await response.json();

        if (result.success && result.data) {
          const fetchedDate = new Date(result.data.eventDate);
          setEventDate(fetchedDate);
          // Armazena no cache local
          localStorage.setItem("eventDate", result.data.eventDate);
        } else {
          // Fallback para data passada como prop ou data padrão
          const fallbackDate =
            targetDate || new Date("2025-11-01T16:30:00-03:00");
          setEventDate(fallbackDate);
          localStorage.setItem("eventDate", fallbackDate.toISOString());
        }
      } catch (error) {
        console.error("Erro ao buscar data do evento:", error);
        // Fallback para data passada como prop ou data padrão
        const fallbackDate =
          targetDate || new Date("2025-11-01T16:30:00-03:00");
        setEventDate(fallbackDate);
        localStorage.setItem("eventDate", fallbackDate.toISOString());
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDate();
  }, [targetDate]);

  useEffect(() => {
    if (!eventDate) return;

    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date().getTime();
      const target = eventDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setIsEventPassed(false);
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        };
      } else {
        setIsEventPassed(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Calculate initial time left
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [eventDate]);

  if (!isClient || isLoading) {
    return (
      <Card className="glass-effect border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20 animate-pulse">
        <CardContent className="p-4 sm:p-8 md:p-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Clock className="h-8 w-8 text-yellow-400 animate-spin" />
              <h3 className="text-2xl font-bold text-yellow-400">
                Carregando contagem...
              </h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-yellow-400/20 h-20 rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isEventPassed) {
    return (
      <Card className="glass-effect border-2 border-yellow-400/50 shadow-2xl shadow-yellow-400/40 overflow-hidden animate-bounce-in">
        <CardContent className="relative p-4 sm:p-8 md:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-yellow-400 mb-4 font-poppins">
            🎉 A FESTA CHEGOU! 🎉
          </h2>
          <p className="text-white text-xl sm:text-2xl font-inter animate-fade-in-scale">
            Esperamos que esteja se divertindo na celebração!
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" />
            <div
              className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-4 h-4 bg-yellow-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20 overflow-hidden hover-lift animate-fade-in-scale">
      <CardContent className="relative p-4 sm:p-8 md:p-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-yellow-400 mb-4 font-poppins">
            CONTAGEM REGRESSIVA
          </h3>
          <p
            className="text-lg sm:text-xl text-yellow-200 font-inter animate-fade-in-scale"
            style={{ animationDelay: "0.3s" }}
          >
            Faltam poucos dias para a grande celebração!
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div
            className="text-center animate-slide-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="glass-effect border-2 border-yellow-400/40 rounded-2xl p-4 sm:p-6 mb-3 hover-lift animate-heartbeat shadow-lg shadow-yellow-400/20">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-yellow-400 font-poppins">
                {String(timeLeft.days).padStart(2, "0")}
              </div>
            </div>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-yellow-400 uppercase tracking-wider font-inter animate-bounce">
              Dias
            </p>
          </div>

          <div
            className="text-center animate-slide-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <div
              className="glass-effect border-2 border-yellow-400/40 rounded-2xl p-4 sm:p-6 mb-3 hover-lift animate-heartbeat shadow-lg shadow-yellow-400/20"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-yellow-400 font-poppins">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
            </div>
            <p
              className="text-sm sm:text-base lg:text-lg font-bold text-yellow-400 uppercase tracking-wider font-inter animate-bounce"
              style={{ animationDelay: "0.2s" }}
            >
              Horas
            </p>
          </div>

          <div
            className="text-center animate-slide-in-up"
            style={{ animationDelay: "1s" }}
          >
            <div
              className="glass-effect border-2 border-yellow-400/40 rounded-2xl p-4 sm:p-6 mb-3 hover-lift animate-heartbeat shadow-lg shadow-yellow-400/20"
              style={{ animationDelay: "1s" }}
            >
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-yellow-400 font-poppins">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
            </div>
            <p
              className="text-sm sm:text-base lg:text-lg font-bold text-yellow-400 uppercase tracking-wider font-inter animate-bounce"
              style={{ animationDelay: "0.4s" }}
            >
              Minutos
            </p>
          </div>

          <div
            className="text-center animate-slide-in-up"
            style={{ animationDelay: "1.2s" }}
          >
            <div className="glass-effect border-2 border-yellow-400/40 rounded-2xl p-4 sm:p-6 mb-3 hover-lift animate-pulse shadow-lg shadow-yellow-400/20">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-yellow-400 font-poppins">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
            </div>
            <p
              className="text-sm sm:text-base lg:text-lg font-bold text-yellow-400 uppercase tracking-wider font-inter animate-bounce"
              style={{ animationDelay: "0.6s" }}
            >
              Segundos
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
