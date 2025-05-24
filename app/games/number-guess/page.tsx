"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bolt } from "lucide-react"

import { ShockEffect } from "@/components/shock-effect"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NumberGuess() {
  const [targetNumber, setTargetNumber] = useState(0)
  const [player1Guess, setPlayer1Guess] = useState("")
  const [player2Guess, setPlayer2Guess] = useState("")
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1)
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [roundResult, setRoundResult] = useState<string | null>(null)
  const [showShock, setShowShock] = useState(false)
  const [loser, setLoser] = useState("")
  const [timeLeft, setTimeLeft] = useState(10)
  const [timerActive, setTimerActive] = useState(false)

  useEffect(() => {
    generateNewNumber()
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (timerActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timerActive && timeLeft === 0) {
      handleTimeout()
    }

    return () => clearTimeout(timer)
  }, [timeLeft, timerActive])

  const generateNewNumber = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1)
    setPlayer1Guess("")
    setPlayer2Guess("")
    setRoundResult(null)
    setCurrentPlayer(1)
    setTimeLeft(10)
    setTimerActive(true)
  }

  const handleTimeout = () => {
    setTimerActive(false)

    if (currentPlayer === 1) {
      setPlayer1Guess("Zeit abgelaufen")
      setCurrentPlayer(2)
      setTimeLeft(10)
      setTimerActive(true)
    } else {
      setPlayer2Guess("Zeit abgelaufen")
      evaluateGuesses()
    }
  }

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTimerActive(false)

    if (currentPlayer === 1) {
      setCurrentPlayer(2)
      setTimeLeft(10)
      setTimerActive(true)
    } else {
      evaluateGuesses()
    }
  }

  const evaluateGuesses = () => {
    const p1Guess = player1Guess === "Zeit abgelaufen" ? 101 : Number.parseInt(player1Guess)
    const p2Guess = player2Guess === "Zeit abgelaufen" ? 101 : Number.parseInt(player2Guess)

    const p1Diff = Math.abs(targetNumber - p1Guess)
    const p2Diff = Math.abs(targetNumber - p2Guess)

    let result

    if (p1Diff === p2Diff) {
      result = "Unentschieden! Beide waren gleich nah."
    } else if (p1Diff < p2Diff) {
      result = "Spieler 1 gewinnt diese Runde!"
      setPlayer1Score(player1Score + 1)
      setLoser("Spieler 2")
      setShowShock(true)
    } else {
      result = "Spieler 2 gewinnt diese Runde!"
      setPlayer2Score(player2Score + 1)
      setLoser("Spieler 1")
      setShowShock(true)
    }

    setRoundResult(result)
  }

  const resetGame = () => {
    setPlayer1Score(0)
    setPlayer2Score(0)
    generateNewNumber()
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-yellow-300 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="outline" className="border-yellow-500/50 text-yellow-300">
              <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
            </Button>
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bolt className="h-6 w-6 text-yellow-400" />
            ZAHLENRATEN
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

          {roundResult ? (
            <div className="mb-6">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold mb-2">Die Zahl war: {targetNumber}</div>
                <div className="text-xl">{roundResult}</div>
              </div>
              <div className="flex justify-between mb-4">
                <div>Spieler 1: {player1Guess}</div>
                <div>Spieler 2: {player2Guess}</div>
              </div>
              <Button onClick={generateNewNumber} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black">
                Nächste Runde
              </Button>
            </div>
          ) : (
            <div>
              <div className="text-center mb-4">
                <div className="text-xl">Spieler {currentPlayer} ist am Zug</div>
                <div className="text-sm text-yellow-100/70 mt-1">Rate eine Zahl zwischen 1 und 100</div>
                <div className="text-lg font-bold mt-2">Zeit: {timeLeft} Sekunden</div>
              </div>

              <form onSubmit={handleGuessSubmit}>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={currentPlayer === 1 ? player1Guess : player2Guess}
                    onChange={(e) =>
                      currentPlayer === 1 ? setPlayer1Guess(e.target.value) : setPlayer2Guess(e.target.value)
                    }
                    placeholder="Deine Vermutung..."
                    className="bg-zinc-700 border-yellow-500/30 text-yellow-100"
                  />
                  <Button type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-black">
                    Raten
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-yellow-500/20">
            <Button onClick={resetGame} variant="outline" className="w-full border-yellow-500/50 text-yellow-300">
              Spiel zurücksetzen
            </Button>
          </div>
        </div>
      </div>

      <ShockEffect player={loser} isActive={showShock} onComplete={() => setShowShock(false)} />
    </div>
  )
}
