"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bolt, Flag, Car } from "lucide-react"

import { ShockEffect } from "@/components/shock-effect"
import { Button } from "@/components/ui/button"

export default function RacingGame() {
  const [player1Position, setPlayer1Position] = useState(0)
  const [player2Position, setPlayer2Position] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [winner, setWinner] = useState<1 | 2 | null>(null)
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [showShock, setShowShock] = useState(false)
  const [loser, setLoser] = useState("")

  const TRACK_LENGTH = 100
  const FINISH_LINE = 100

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameActive) return

      // Player 1 uses Q key
      if (e.key.toLowerCase() === "q" && player1Position < FINISH_LINE) {
        setPlayer1Position((prev) => Math.min(prev + 1, FINISH_LINE))
      }

      // Player 2 uses P key
      if (e.key.toLowerCase() === "p" && player2Position < FINISH_LINE) {
        setPlayer2Position((prev) => Math.min(prev + 1, FINISH_LINE))
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameActive, player1Position, player2Position])

  useEffect(() => {
    // Check for winner
    if (player1Position >= FINISH_LINE && gameActive) {
      setWinner(1)
      setPlayer1Score(player1Score + 1)
      setGameActive(false)
      setLoser("Spieler 2")
      try {
          fetch("http://192.168.166.203:5000/player2", {
            method: "POST",
          })
          console.log("Error API called")
        } catch (error) {
          console.error("Failed to call error API:", error)
        }
      setShowShock(true)
    } else if (player2Position >= FINISH_LINE && gameActive) {
      setWinner(2)
      setPlayer2Score(player2Score + 1)
      setGameActive(false)
      setLoser("Spieler 1")
      try {
          fetch("http://192.168.166.203:5000/player1", {
            method: "POST",
          })
          console.log("Error API called")
        } catch (error) {
          console.error("Failed to call error API:", error)
        }
      setShowShock(true)
    }
  }, [player1Position, player2Position, gameActive])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (countdown !== null) {
      if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown(countdown - 1)
        }, 1000)
      } else {
        setGameActive(true)
      }
    }

    return () => clearTimeout(timer)
  }, [countdown])

  const startGame = () => {
    setPlayer1Position(0)
    setPlayer2Position(0)
    setWinner(null)
    setCountdown(3)
  }

  const resetGame = () => {
    setPlayer1Score(0)
    setPlayer2Score(0)
    setPlayer1Position(0)
    setPlayer2Position(0)
    setWinner(null)
    setGameActive(false)
    setCountdown(null)
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
            RACING
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
            ) : winner ? (
              <div className="text-2xl font-bold">Spieler {winner} gewinnt!</div>
            ) : gameActive ? (
              <div className="text-2xl font-bold text-green-500">LOS! LOS! LOS!</div>
            ) : (
              <div className="text-xl">Drücke Start um zu beginnen</div>
            )}
          </div>

          <div className="mb-8">
            {/* Player 1 Track */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <div className="w-24 text-right mr-2">Spieler 1 (Q)</div>
                <div className="flex-1 h-10 bg-zinc-700 rounded-full relative overflow-hidden">
                  <div
                    className="absolute h-full bg-yellow-600 transition-all duration-100 flex items-center"
                    style={{ width: `${player1Position}%` }}
                  >
                    {player1Position > 0 && <Car className="h-6 w-6 ml-auto mr-1 text-black" />}
                  </div>
                  <Flag className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            {/* Player 2 Track */}
            <div>
              <div className="flex items-center mb-2">
                <div className="w-24 text-right mr-2">Spieler 2 (P)</div>
                <div className="flex-1 h-10 bg-zinc-700 rounded-full relative overflow-hidden">
                  <div
                    className="absolute h-full bg-yellow-600 transition-all duration-100 flex items-center"
                    style={{ width: `${player2Position}%` }}
                  >
                    {player2Position > 0 && <Car className="h-6 w-6 ml-auto mr-1 text-black" />}
                  </div>
                  <Flag className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={startGame}
              className="bg-yellow-600 hover:bg-yellow-500 text-black"
              disabled={gameActive || countdown !== null}
            >
              {winner ? "Neue Runde" : "Start"}
            </Button>
            <Button onClick={resetGame} variant="outline" className="border-yellow-500/50 text-yellow-300">
              Spiel zurücksetzen
            </Button>
          </div>

          <div className="mt-6 text-center text-yellow-100/70 text-sm">
            <p>Spieler 1: Drücke schnell die Q-Taste</p>
            <p>Spieler 2: Drücke schnell die P-Taste</p>
          </div>
        </div>
      </div>

      <ShockEffect player={loser} isActive={showShock} onComplete={() => setShowShock(false)} />
    </div>
  )
}
