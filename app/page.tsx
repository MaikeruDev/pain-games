import Link from "next/link"
import { Bolt, Gamepad2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-900 text-yellow-300">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bolt className="h-10 w-10 text-yellow-400" />
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">PAIN GAMES</h1>
            <Bolt className="h-10 w-10 text-yellow-400" />
          </div>
          <p className="text-xl text-yellow-100/80">Verlieren tut weh! Lokale 2-Spieler Spiele mit Konsequenzen.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <GameCard
            title="Pong"
            description="Der Klassiker. Verpasse den Ball und spüre den Schmerz!"
            href="/games/pong"
          />
          <GameCard
            title="Schere Stein Papier"
            description="Spieler 1: A,S,D | Spieler 2: J,K,L. Wähle weise!"
            href="/games/rock-paper-scissors"
          />
          <GameCard
            title="Tic Tac Toe"
            description="Drei in einer Reihe oder zittere vor Angst."
            href="/games/tic-tac-toe"
          />
          <GameCard
            title="Racing"
            description="Drücke schnell deine Taste und gewinne das Rennen!"
            href="/games/racing"
          />
          <GameCard
            title="Heiße Kartoffel"
            description="Gib die Bombe weiter, bevor sie explodiert!"
            href="/games/hot-potato"
          />
          <GameCard
            title="Zahlenraten"
            description="Rate die Zahl zuerst oder leide die Konsequenzen."
            href="/games/number-guess"
          />
        </div>
      </div>
    </div>
  )
}

function GameCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <div className="bg-zinc-800 border-2 border-yellow-500/30 rounded-lg overflow-hidden hover:border-yellow-400 transition-all group">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Gamepad2 className="h-5 w-5 text-yellow-400" />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <p className="text-yellow-100/70 mb-4">{description}</p>
        <Link href={href}>
          <Button className="w-full bg-yellow-600 hover:bg-yellow-500 text-black">Spielen</Button>
        </Link>
      </div>
    </div>
  )
}
