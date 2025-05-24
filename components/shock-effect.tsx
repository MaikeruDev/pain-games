"use client"

import { useEffect, useState } from "react"
import { Bolt } from "lucide-react"

interface ShockEffectProps {
  player: string
  isActive: boolean
  onComplete: () => void
}

export function ShockEffect({ player, isActive, onComplete }: ShockEffectProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isActive) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        onComplete()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete])

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="shock-effect bg-zinc-900 border-4 border-yellow-500 p-8 rounded-lg max-w-md text-center">
        <Bolt className="h-20 w-20 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-yellow-300 mb-2">ELEKTROSCHOCK!</h2>
        <p className="text-xl text-yellow-100">{player} hat verloren und erhält einen Schock!</p>
      </div>
    </div>
  )
}
