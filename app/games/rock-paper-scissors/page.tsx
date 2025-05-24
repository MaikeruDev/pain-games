"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bolt, Hand, Scissors, Square } from "lucide-react"

import { ShockEffect } from "@/components/shock-effect"
import { Button } from "@/components/ui/button"

type Choice = "rock" | "paper" | "scissors" | null
type Player = "player1" | "player2" | "draw" | null

export default function RockPaperScissors() {
  const [player1Choice, setPlayer1Choice] = useState<Choice>(null)
  const [player2Choice, setPlayer2Choice] = useState<Choice>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [winner, setWinner] = useState<Player>(null)
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [showShock, setShowShock] = useState(false)
  const [loser, setLoser] = useState("")
  const [roundActive, setRoundActive] = useState(false)
  const [message, setMessage] = useState("Drücke 'Runde starten' um zu beginnen")

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!roundActive || countdown !== 0) return

      // Player 1 controls (A, S, D)
      if (!player1Choice) {
        if (e.key.toLowerCase() === "a") setPlayer1Choice("rock")
        if (e.key.toLowerCase() === "s") setPlayer1Choice("paper")
        if (e.key.toLowerCase() === "d") setPlayer1Choice("scissors")
      }

      // Player 2 controls (J, K, L)
      if (!player2Choice) {
        if (e.key.toLowerCase() === "j") setPlayer2Choice("rock")
        if (e.key.toLowerCase() === "k") setPlayer2Choice("paper")
        if (e.key.toLowerCase() === "l") setPlayer2Choice("scissors")
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [roundActive, countdown, player1Choice, player2Choice])

  useEffect(() => {
    // Check if both players have made their choices
    if (player1Choice && player2Choice && roundActive) {
      determineWinner()
    }
  }, [player1Choice, player2Choice])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdown === 0) {
      setMessage("JETZT! Drücke deine Taste!")
    }

    return () => clearTimeout(timer)
  }, [countdown])

  const startRound = () => {
    setRoundActive(true)
    setPlayer1Choice(null)
    setPlayer2Choice(null)
    setWinner(null)
    setCountdown(3)
    setMessage("Bereit machen...")
  }

  const determineWinner = () => {
    if (player1Choice === player2Choice) {
      setWinner("draw")
      setMessage("Unentschieden!")
    } else if (
      (player1Choice === "rock" && player2Choice === "scissors") ||
      (player1Choice === "paper" && player2Choice === "rock") ||
      (player1Choice === "scissors" && player2Choice === "paper")
    ) {
      setWinner("player1")
      setPlayer1Score(player1Score + 1)
      setMessage("Spieler 1 gewinnt!")

      // Delay the shock effect by 1.5 seconds
      setTimeout(() => {
        setLoser("Spieler 2")
        setShowShock(true)
        try {
          fetch("http://192.168.166.203:5000/player2", {
            method: "POST",
          })
          console.log("Error API called")
        } catch (error) {
          console.error("Failed to call error API:", error)
        }
      }, 1500)
    } else {
      setWinner("player2")
      setPlayer2Score(player2Score + 1)
      setMessage("Spieler 2 gewinnt!")

      // Delay the shock effect by 1.5 seconds
      setTimeout(() => {
        setLoser("Spieler 1")
        setShowShock(true)
        try {
          fetch("http://192.168.166.203:5000/player1", {
            method: "POST",
          })
          console.log("Error API called")
        } catch (error) {
          console.error("Failed to call error API:", error)
        }
      }, 1500)
    }

    setRoundActive(false)
  }

  const resetGame = () => {
    setPlayer1Score(0)
    setPlayer2Score(0)
    setPlayer1Choice(null)
    setPlayer2Choice(null)
    setWinner(null)
    setRoundActive(false)
    setCountdown(null)
    setMessage("Drücke 'Runde starten' um zu beginnen")
  }

  const getChoiceIcon = (choice: Choice) => {
    switch (choice) {
      case "rock":
        return <Square className="h-12 w-12" />
      case "paper":
        return <Hand className="h-12 w-12" />
      case "scissors":
        return <Scissors className="h-12 w-12" />
      default:
        return (
          <div className="h-12 w-12 rounded-full border-2 border-dashed border-yellow-500/30 flex items-center justify-center">
            ?
          </div>
        )
    }
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
            SCHERE STEIN PAPIER
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

          <div className="flex flex-col items-center mb-8">
            <div className="text-2xl mb-4 h-8">{countdown !== null && countdown > 0 ? countdown : ""}</div>

            <div className="text-xl mb-6 h-8">{message}</div>

            <div className="flex justify-center gap-16 my-8">
              <div className="flex flex-col items-center">
                <div className="text-lg mb-2">Spieler 1</div>
                <div className="h-24 w-24 bg-zinc-700 rounded-lg flex items-center justify-center">
                  {getChoiceIcon(player1Choice)}
                </div>
                <div className="mt-2 text-sm text-yellow-100/70">A = Stein | S = Papier | D = Schere</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg mb-2">Spieler 2</div>
                <div className="h-24 w-24 bg-zinc-700 rounded-lg flex items-center justify-center">
                  {getChoiceIcon(player2Choice)}
                </div>
                <div className="mt-2 text-sm text-yellow-100/70">J = Stein | K = Papier | L = Schere</div>
              </div>
            </div>

            <Button
              onClick={startRound}
              className="bg-yellow-600 hover:bg-yellow-500 text-black mt-4"
              disabled={roundActive}
            >
              Runde starten
            </Button>
          </div>

          <div className="flex justify-center">
            <Button onClick={resetGame} variant="outline" className="border-yellow-500/50 text-yellow-300">
              Spiel zurücksetzen
            </Button>
          </div>
        </div>
      </div>

      <ShockEffect player={loser} isActive={showShock} onComplete={() => setShowShock(false)} />
    </div>
  )
}
