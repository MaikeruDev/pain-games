import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pain Games - 2-Player Games mit Konsequenzen",
  description:
    "Eine Sammlung von lokalen 2-Spieler Spielen, bei denen der Verlierer einen simulierten Elektroschock erhält.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
