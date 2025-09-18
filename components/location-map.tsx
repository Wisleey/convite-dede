"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Navigation } from "lucide-react"

interface LocationMapProps {
  location: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
}

export function LocationMap({ location, address, coordinates }: LocationMapProps) {
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`
    window.open(url, "_blank")
  }

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}&travelmode=driving`
    window.open(url, "_blank")
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.123456789!2d${coordinates.lng}!3d${coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMTQnMjEuOCJTIDM0wrA0OCcxMy4zIlc!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr&q=${encodeURIComponent(address)}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg"
        />
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-semibold text-lg mb-2">{location}</h4>
        <p className="text-muted-foreground mb-4">{address}</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={openDirections} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Navigation className="mr-2 h-4 w-4" />
            Como Chegar
          </Button>
          <Button
            onClick={openInGoogleMaps}
            variant="outline"
            className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver no Google Maps
          </Button>
        </div>
      </div>
    </div>
  )
}
