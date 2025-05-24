"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bolt, Circle, X } from "lucide-react"

import { ShockEffect } from "@/components/shock-effect"
import { Button } from "@/components/ui/button"

type Player = "X" | "O"
type BoardState = (Player | null)[]

export default function TicTacToe() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
  const [winner, setWinner] = useState<Player | "draw" | null>(null)
  const [xWins, setXWins] = useState(0)
  const [oWins, setOWins] = useState(0)
  const [showShock, setShowShock] = useState(false)
  const [loser, setLoser] = useState("")

  const checkWinner = (board: BoardState): Player | "draw" | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as Player
      }
    }

    if (board.every((cell) => cell !== null)) {
      return "draw"
    }

    return null
  }

  const handleClick = (index: number) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const gameWinner = checkWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
      if (gameWinner === "X") {
        setXWins(xWins + 1)
        setLoser("Spieler O")
        try {
          fetch("http://192.168.166.203:5000/player2", {
            method: "POST",
          })
          console.log("Error API called")
        } catch (error) {
          console.error("Failed to call error API:", error)
        }
        setShowShock(true)
      } else if (gameWinner === "O") {
        setOWins(oWins + 1)
        setLoser("Spieler X")
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
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
  }

  const resetScore = () => {
    resetGame()
    setXWins(0)
    setOWins(0)
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
            TIC TAC TOE
          </h1>
          <div className="w-24"></div>
        </div>

        <div className="bg-zinc-800 p-6 rounded-lg border-2 border-yellow-500/30">
          <div className="flex justify-between mb-6">
            <div className="text-xl">
              Spieler X (1): <span className="font-bold">{xWins}</span>
            </div>
            <div className="text-xl">
              Spieler O (2): <span className="font-bold">{oWins}</span>
            </div>
          </div>

          <div className="mb-6 text-center">
            {winner ? (
              <div className="text-xl">{winner === "draw" ? "Unentschieden!" : `Spieler ${winner} gewinnt!`}</div>
            ) : (
              <div className="text-xl">Spieler {currentPlayer} ist am Zug</div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {board.map((cell, index) => (
              <Button
                key={index}
                onClick={() => handleClick(index)}
                className="h-24 w-full bg-zinc-700 hover:bg-zinc-600 border border-yellow-500/30 flex items-center justify-center"
                disabled={!!cell || !!winner}
              >
                {cell === "X" && <X className="h-12 w-12 text-white" />}
                {cell === "O" && <Circle className="h-12 w-12 text-white" />}
              </Button>
            ))}
          </div>

          <div className="flex justify-between">
            <Button onClick={resetGame} className="bg-yellow-600 hover:bg-yellow-500 text-black">
              Neues Spiel
            </Button>
            <Button onClick={resetScore} variant="outline" className="border-yellow-500/50 text-yellow-300">
              Punkte zurücksetzen
            </Button>
          </div>
        </div>
      </div>

      <ShockEffect player={loser} isActive={showShock} onComplete={() => setShowShock(false)} />
    </div>
  )
}
