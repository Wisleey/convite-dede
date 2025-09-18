"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface CountdownTimerProps {
  targetDate: Date
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isEventPassed, setIsEventPassed] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
        setIsEventPassed(false)
      } else {
        setIsEventPassed(true)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (isEventPassed) {
    return (
      <Card className="bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-xl border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20">
        <CardContent className="p-8 text-center">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-4">
            🎉 O EVENTO JÁ COMEÇOU! 🎉
          </h2>
          <p className="text-white text-xl">Esperamos que esteja se divertindo!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-xl border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-2">
            CONTAGEM REGRESSIVA
          </h2>
          <p className="text-white text-lg">Faltam apenas:</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div className="text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 blur-lg rounded-2xl" />
              <div className="relative bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6">
                <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                  {timeLeft.days.toString().padStart(2, "0")}
                </div>
              </div>
            </div>
            <p className="text-yellow-400 font-bold text-lg uppercase tracking-wide">Dias</p>
          </div>

          <div className="text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 blur-lg rounded-2xl" />
              <div className="relative bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6">
                <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </div>
              </div>
            </div>
            <p className="text-yellow-400 font-bold text-lg uppercase tracking-wide">Horas</p>
          </div>

          <div className="text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 blur-lg rounded-2xl" />
              <div className="relative bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6">
                <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </div>
              </div>
            </div>
            <p className="text-yellow-400 font-bold text-lg uppercase tracking-wide">Minutos</p>
          </div>

          <div className="text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 blur-lg rounded-2xl" />
              <div className="relative bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 animate-pulse">
                <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </div>
              </div>
            </div>
            <p className="text-yellow-400 font-bold text-lg uppercase tracking-wide">Segundos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
