import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Providers } from "./providers";

import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PlasticDetect - Détection de déchets plastiques",
  description: "Dashboard pour la détection et l'analyse de déchets plastiques dans l'eau",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}