import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { MainNav } from "@/components/main-nav" // Import the new MainNav component

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Waternity - RWA Water Well Tokenization",
  description: "Stake USDC in water wells, earn real yield, and provide clean water access to communities",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainNav /> {/* Add the MainNav component here */}
        {children}
        <Toaster />
      </body>
    </html>
  )
}
