"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bolt, Bomb } from "lucide-react"

import { ShockEffect } from "@/components/shock-effect"
import { Button } from "@/components/ui/button"

export default function HotPotatoGame() {
  const [bombHolder, setBombHolder] = useState<1 | 2>(Math.random() < 0.5 ? 1 : 2)
  const [timeLeft, setTimeLeft] = useState(0)
  const [maxTime, setMaxTime] = useState(15)
  const [gameActive, setGameActive] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [showShock, setShowShock] = useState(false)
  const [loser, setLoser] = useState("")
  const [bombSpeed, setBombSpeed] = useState(1)
  const [bombTicks, setBombTicks] = useState<number[]>([])
  const [exploded, setExploded] = useState(false)

  // Generate random bomb ticks (when the bomb will explode)
  useEffect(() => {
    if (gameActive && bombTicks.length === 0) {
      // Generate a random time between 5-15 seconds
      const explodeTime = Math.floor(Math.random() * 10) + 5
      setMaxTime(explodeTime)
      setTimeLeft(explodeTime)

      // Generate some fake ticks to make it unpredictable
      const fakeTicks = []
      const numFakeTicks = Math.floor(Math.random() * 3) + 2
      for (let i = 0; i < numFakeTicks; i++) {
        fakeTicks.push(Math.floor(Math.random() * (explodeTime - 2)) + 1)
      }
      setBombTicks([...fakeTicks, explodeTime])
    }
  }, [gameActive, bombTicks])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameActive || exploded) return

      // Player 1 uses Q key
      if (e.key.toLowerCase() === "q" && bombHolder === 1) {
        setBombHolder(2)
        // Increase bomb speed slightly each pass
        setBombSpeed((prev) => Math.min(prev + 0.1, 3))
      }

      // Player 2 uses P key
      if (e.key.toLowerCase() === "p" && bombHolder === 2) {
        setBombHolder(1)
        // Increase bomb speed slightly each pass
        setBombSpeed((prev) => Math.min(prev + 0.1, 3))
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameActive, bombHolder, exploded])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (countdown !== null) {
      if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown(countdown - 1)
        }, 1000)
      } else {
        setGameActive(true)
        startGameTimer()
      }
    }

    return () => clearTimeout(timer)
  }, [countdown])

  const startGameTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          endGame()
          return 0
        }

        // Check if this is a tick time
        const newTime = prev - 0.1 * bombSpeed
        if (bombTicks.includes(Math.ceil(newTime))) {
          // Make the bomb "tick" visually
          const bombElement = document.getElementById("bomb")
          if (bombElement) {
            bombElement.classList.add("bomb-tick")
            setTimeout(() => {
              bombElement.classList.remove("bomb-tick")
            }, 300)
          }
        }

        // If we've reached the end, explode
        if (newTime <= 0) {
          setExploded(true)
          return 0
        }

        return newTime
      })
    }, 100) // Update 10 times per second for smoother countdown
  }

  const startGame = () => {
    setBombHolder(Math.random() < 0.5 ? 1 : 2)
    setBombTicks([])
    setExploded(false)
    setBombSpeed(1)
    setCountdown(3)
  }

  const endGame = () => {
    setGameActive(false)

    if (bombHolder === 1) {
      setPlayer2Score(player2Score + 1)
      setTimeout(() => {
        setLoser("Spieler 1")
        setShowShock(true)
      }, 1500)
    } else {
      setPlayer1Score(player1Score + 1)
      setTimeout(() => {
        setLoser("Spieler 2")
        setShowShock(true)
      }, 1500)
    }
  }

  const resetGame = () => {
    setPlayer1Score(0)
    setPlayer2Score(0)
    setBombHolder(Math.random() < 0.5 ? 1 : 2)
    setTimeLeft(0)
    setGameActive(false)
    setCountdown(null)
    setBombTicks([])
    setExploded(false)
    setBombSpeed(1)
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-yellow-300 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="outline" className="border-yellow-500/50 text-yellow-300">
              <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
            </Button>
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bolt className="h-6 w-6 text-yellow-400" />
            HEISSE KARTOFFEL
          </h1>
          <div className="w-24"></div>
        </div>

        <div className="bg-zinc-800 p-6 rounded-lg border-2 border-yellow-500/30">
          <div className="flex justify-between mb-6">
            <div className="text-xl">
              Spieler 1: <span className="font-bold">{player1Score}</span>
            </div>
            <div className="text-xl">
              Spieler 2: <span className="font-bold">{player2Score}</span>
            </div>
          </div>

          <div className="text-center mb-6">
            {countdown !== null && countdown > 0 ? (
              <div className="text-3xl font-bold">{countdown}</div>
            ) : gameActive ? (
              <div className="text-xl font-bold">
                Gib die Bombe weiter! <span className="text-red-500">{Math.ceil(timeLeft)}</span>
              </div>
            ) : exploded ? (
              <div className="text-2xl font-bold text-red-500">BOOM! Spieler {bombHolder} verliert!</div>
            ) : (
              <div className="text-xl">Drücke Start um zu beginnen</div>
            )}
          </div>

          <div className="flex justify-center mb-8">
            <div
              id="bomb"
              className={`relative w-32 h-32 rounded-full bg-zinc-700 flex items-center justify-center transition-all ${
                exploded ? "bg-red-600 bomb-explode" : ""
              }`}
            >
              <Bomb
                className={`h-16 w-16 ${bombHolder === 1 ? "text-blue-400" : "text-green-400"} ${
                  exploded ? "text-yellow-300 bomb-shake" : ""
                }`}
              />
              {gameActive && !exploded && (
                <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-pulse"></div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="text-lg mb-2">Spieler 1 (Q-Taste)</div>
              <div
                className={`w-full h-16 rounded-lg flex items-center justify-center text-xl font-bold ${
                  bombHolder === 1 ? "bg-blue-900 border-2 border-blue-400" : "bg-zinc-700"
                }`}
              >
                {bombHolder === 1 ? "HAT DIE BOMBE!" : ""}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-lg mb-2">Spieler 2 (P-Taste)</div>
              <div
                className={`w-full h-16 rounded-lg flex items-center justify-center text-xl font-bold ${
                  bombHolder === 2 ? "bg-green-900 border-2 border-green-400" : "bg-zinc-700"
                }`}
              >
                {bombHolder === 2 ? "HAT DIE BOMBE!" : ""}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={startGame}
              className="bg-yellow-600 hover:bg-yellow-500 text-black"
              disabled={gameActive || countdown !== null}
            >
              {exploded ? "Neue Runde" : "Start"}
            </Button>
            <Button onClick={resetGame} variant="outline" className="border-yellow-500/50 text-yellow-300">
              Spiel zurücksetzen
            </Button>
          </div>

          <div className="mt-6 text-center text-yellow-100/70 text-sm">
            <p>Drücke deine Taste um die Bombe weiterzugeben!</p>
            <p>Spieler 1: Q-Taste | Spieler 2: P-Taste</p>
            <p>Wer die Bombe hält wenn sie explodiert, verliert!</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .bomb-tick {
          transform: scale(1.1);
          background-color: #b91c1c;
        }
        
        .bomb-explode {
          animation: explode 0.5s;
        }
        
        .bomb-shake {
          animation: shake 0.5s;
        }
        
        @keyframes explode {
          0% { transform: scale(1); }
          50% { transform: scale(1.5); }
          100% { transform: scale(1); }
        }
        
        @keyframes shake {
          0% { transform: translate(0, 0) rotate(0); }
          10% { transform: translate(-5px, -5px) rotate(-5deg); }
          20% { transform: translate(5px, 5px) rotate(5deg); }
          30% { transform: translate(-5px, 5px) rotate(-5deg); }
          40% { transform: translate(5px, -5px) rotate(5deg); }
          50% { transform: translate(-5px, 0) rotate(-5deg); }
          60% { transform: translate(5px, 0) rotate(5deg); }
          70% { transform: translate(0, -5px) rotate(0); }
          80% { transform: translate(0, 5px) rotate(0); }
          90% { transform: translate(-5px, -5px) rotate(-5deg); }
          100% { transform: translate(0, 0) rotate(0); }
        }
      `}</style>

      <ShockEffect player={loser} isActive={showShock} onComplete={() => setShowShock(false)} />
    </div>
  )
}
