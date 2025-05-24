"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bolt } from "lucide-react"

import { ShockEffect } from "@/components/shock-effect"
import { Button } from "@/components/ui/button"

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [loser, setLoser] = useState("")
  const [showShock, setShowShock] = useState(false)

  const WINNING_SCORE = 5

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const paddleHeight = 100
    const paddleWidth = 10
    const ballRadius = 10

    let player1Y = canvas.height / 2 - paddleHeight / 2
    let player2Y = canvas.height / 2 - paddleHeight / 2
    let ballX = canvas.width / 2
    let ballY = canvas.height / 2
    let ballSpeedX = 5
    let ballSpeedY = 2

    const keyState: Record<string, boolean> = {}

    const handleKeyDown = (e: KeyboardEvent) => {
      keyState[e.key] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keyState[e.key] = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    const gameLoop = () => {
      if (gameOver) return

      // Clear canvas
      ctx.fillStyle = "#18181b"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw center line
      ctx.beginPath()
      ctx.setLineDash([10, 15])
      ctx.moveTo(canvas.width / 2, 0)
      ctx.lineTo(canvas.width / 2, canvas.height)
      ctx.strokeStyle = "#facc15"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.setLineDash([])

      // Move paddles
      if (keyState["w"] && player1Y > 0) {
        player1Y -= 7
      }
      if (keyState["s"] && player1Y < canvas.height - paddleHeight) {
        player1Y += 7
      }
      if (keyState["ArrowUp"] && player2Y > 0) {
        player2Y -= 7
      }
      if (keyState["ArrowDown"] && player2Y < canvas.height - paddleHeight) {
        player2Y += 7
      }

      // Draw paddles
      ctx.fillStyle = "#facc15"
      ctx.fillRect(0, player1Y, paddleWidth, paddleHeight)
      ctx.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight)

      // Move ball
      ballX += ballSpeedX
      ballY += ballSpeedY

      // Ball collision with top and bottom
      if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY
      }

      // Ball collision with paddles
      if (ballX - ballRadius < paddleWidth && ballY > player1Y && ballY < player1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX
        // Add some angle based on where the ball hits the paddle
        const impact = (ballY - (player1Y + paddleHeight / 2)) / (paddleHeight / 2)
        ballSpeedY = impact * 5
      }

      if (ballX + ballRadius > canvas.width - paddleWidth && ballY > player2Y && ballY < player2Y + paddleHeight) {
        ballSpeedX = -ballSpeedX
        // Add some angle based on where the ball hits the paddle
        const impact = (ballY - (player2Y + paddleHeight / 2)) / (paddleHeight / 2)
        ballSpeedY = impact * 5
      }

      // Score points
      if (ballX < 0) {
        const newScore = player2Score + 1
        setPlayer2Score(newScore)
        if (newScore >= WINNING_SCORE) {
          setGameOver(true)
          setLoser("Spieler 1")
          setShowShock(true)
        }
        resetBall()
      } else if (ballX > canvas.width) {
        const newScore = player1Score + 1
        setPlayer1Score(newScore)
        if (newScore >= WINNING_SCORE) {
          setGameOver(true)
          setLoser("Spieler 2")
          setShowShock(true)
        }
        resetBall()
      }

      // Draw ball
      ctx.beginPath()
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2)
      ctx.fillStyle = "#facc15"
      ctx.fill()
      ctx.closePath()

      requestAnimationFrame(gameLoop)
    }

    const resetBall = () => {
      ballX = canvas.width / 2
      ballY = canvas.height / 2
      ballSpeedX = -ballSpeedX
      ballSpeedY = Math.random() * 4 - 2
    }

    // Start the game loop
    const animationId = requestAnimationFrame(gameLoop)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      cancelAnimationFrame(animationId)
    }
  }, [gameOver, player1Score, player2Score])

  const resetGame = () => {
    setPlayer1Score(0)
    setPlayer2Score(0)
    setGameOver(false)
    setLoser("")
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
            PONG
          </h1>
          <div className="w-24"></div>
        </div>

        <div className="bg-zinc-800 p-4 rounded-lg border-2 border-yellow-500/30">
          <div className="flex justify-between mb-4">
            <div className="text-xl">
              Spieler 1: <span className="font-bold">{player1Score}</span>
            </div>
            <div className="text-xl">
              Spieler 2: <span className="font-bold">{player2Score}</span>
            </div>
          </div>

          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="bg-zinc-900 w-full h-auto rounded border border-yellow-500/30"
            />

            {gameOver && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="bg-zinc-800 border-2 border-yellow-500 p-6 rounded-lg text-center">
                  <h2 className="text-2xl font-bold mb-4">Spiel vorbei!</h2>
                  <p className="text-xl mb-4">{player1Score > player2Score ? "Spieler 1" : "Spieler 2"} gewinnt!</p>
                  <Button onClick={resetGame} className="bg-yellow-600 hover:bg-yellow-500 text-black">
                    Neues Spiel
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-yellow-100/70 text-center">
            <p>Steuerung: Spieler 1 (W/S) - Spieler 2 (Pfeiltasten Hoch/Runter)</p>
            <p>Erster Spieler mit {WINNING_SCORE} Punkten gewinnt!</p>
          </div>
        </div>
      </div>

      <ShockEffect player={loser} isActive={showShock} onComplete={() => setShowShock(false)} />
    </div>
  )
}
