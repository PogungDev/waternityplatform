import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MainNav } from "@/components/main-nav"
import { WalletProvider } from "@/components/wallet-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "Waternity Platform - Chainlink Hackathon",
  description: "Water well NFT platform with Chainlink automation, data feeds, and external verification",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <WalletProvider>
          <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center">
                <MainNav />
              </div>
            </header>
            <main className="min-h-[calc(100vh-3.5rem)]">
              {children}
            </main>
          </div>
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  )
}
